import fs from 'node:fs';
import path from 'node:path';
import { extractImageReferences } from './lib/extract-image-references.mjs';
import { resolveMarkdownInputs } from './lib/resolve-markdown-inputs.mjs';
import { createPathReserver, downloadToPath } from './lib/download-image.mjs';
import { replaceImageRef, writeNewMarkdown } from './lib/markdown-link.mjs';
import { discoverAssetDir } from './lib/discover-asset-dir.mjs';

const DOWNLOAD_CONCURRENCY = 8;

async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }
  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function downloadMarkdownFile(mdPath, explicitAssetsDir) {
  const mdDir = path.dirname(mdPath);
  const mdStem = path.basename(mdPath, '.md');
  const assetsDir = explicitAssetsDir || discoverAssetDir(mdPath) || path.join(mdDir, `${mdStem}.assets`);

  const allRefs = await extractImageReferences(mdPath);
  const externalRefs = allRefs.filter((ref) => ref.isExternal);

  if (externalRefs.length === 0) {
    console.log('  ℹ️ 未发现外部图片链接');
    return { mdPath, newMdPath: null, downloadedCount: 0, failedCount: 0 };
  }

  // 只在确有外链时才创建目录，避免无外链文档留下空 assets 目录。
  fs.mkdirSync(assetsDir, { recursive: true });
  console.log(`  发现 ${externalRefs.length} 个外部图片链接`);
  console.log(`  保存目录: ${assetsDir}\n`);

  // 串行预占唯一保存路径，规避并发下载时同名 basename 互相覆盖。
  const reserve = createPathReserver(assetsDir);
  const reservations = externalRefs.map(({ src }, i) => ({
    src,
    ...reserve.reserve(src, i + 1),
  }));

  const downloadResults = await mapWithConcurrency(
    reservations,
    DOWNLOAD_CONCURRENCY,
    ({ src, savePath, filename }) => downloadToPath(src, savePath, filename),
  );

  let content = fs.readFileSync(mdPath, 'utf-8');
  let changed = false;
  let downloadedCount = 0;
  let failedCount = 0;

  for (const [i, result] of downloadResults.entries()) {
    const { src } = reservations[i];
    const index = i + 1;
    console.log(`  [${index}/${externalRefs.length}] ${src}`);
    if (result.success) {
      const relPath = path.relative(mdDir, result.savedPath).replace(/\\/g, '/');
      content = replaceImageRef(content, src, relPath);
      changed = true;
      downloadedCount++;
      console.log(`    ✅ 已下载: ${relPath}`);
    } else {
      failedCount++;
      console.log(`    ⚠️ 下载失败: ${result.error?.message || 'unknown'}`);
    }
  }

  let newMdPath = null;
  if (changed) {
    newMdPath = writeNewMarkdown(mdPath, content);
    console.log(`\n  📝 已生成: ${newMdPath}`);
  }

  // 仅当全部外链都下载失败时才标记阶段失败。部分失败（外站图片易失效）
  // 不应让整条 pipeline 报「download 阶段失败」，失败数已在上方日志中体现。
  if (failedCount > 0 && downloadedCount === 0) {
    process.exitCode = 1;
  }

  return { mdPath, newMdPath, downloadedCount, failedCount };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('用法: node download.mjs <md输入> [assets目录]');
    console.error('  <md输入> 支持：单个文件、多个文件、glob、目录');
    process.exit(1);
  }

  const mdInput = args[0];
  const explicitAssetsDir = args[1] || null;

  let mdFiles;
  try {
    mdFiles = await resolveMarkdownInputs([mdInput]);
  } catch (error) {
    console.error(`❌ 输入解析失败: ${error.message}`);
    process.exit(1);
  }

  console.log(`\n找到 ${mdFiles.length} 个 Markdown 文件\n`);

  let totalDownloaded = 0;
  let totalFailed = 0;
  let totalGenerated = 0;

  for (const mdPath of mdFiles) {
    console.log(`处理: ${mdPath}`);
    const result = await downloadMarkdownFile(mdPath, explicitAssetsDir);
    totalDownloaded += result.downloadedCount;
    totalFailed += result.failedCount;
    if (result.newMdPath) totalGenerated++;
  }

  console.log('\n处理完成：');
  console.log(`  下载成功: ${totalDownloaded} 张`);
  console.log(`  下载失败: ${totalFailed} 张`);
  console.log(`  生成新文件: ${totalGenerated} 个`);
}

main().catch((error) => {
  console.error('处理过程中发生错误:', error);
  process.exit(1);
});
