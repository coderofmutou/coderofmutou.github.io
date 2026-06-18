import fs from 'node:fs';
import path from 'node:path';
import { extractImageReferences } from './lib/extract-image-references.mjs';
import { resolveMarkdownInputs } from './lib/resolve-markdown-inputs.mjs';
import { encodeToWebp, isWebpImage } from './lib/webp-encode.mjs';
import { replaceImageRef, writeNewMarkdown } from './lib/markdown-link.mjs';

function replaceExt(src, newExt) {
  const ext = path.extname(src);
  if (!ext) return `${src}${newExt}`;
  return src.slice(0, -ext.length) + newExt;
}

function resolveImagePath(ref) {
  const candidates = [ref.absolutePath];

  if (ref.src !== ref.decoded) {
    candidates.push(path.resolve(ref.mdDir, ref.src));
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  return null;
}

function isWithinDir(filePath, dirPath) {
  if (!dirPath) return true;
  const normalizedFile = path.resolve(filePath);
  const normalizedDir = path.resolve(dirPath);
  return normalizedFile.startsWith(normalizedDir + path.sep) || normalizedFile === normalizedDir;
}

async function compressMarkdownFile(mdPath, explicitDir) {
  const refs = await extractImageReferences(mdPath, { filterExternal: true });
  let content = fs.readFileSync(mdPath, 'utf-8');
  let changed = false;
  let compressedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const ref of refs) {
    if (ref.isAbsolute) {
      console.warn(`  ⚠️ 跳过绝对路径引用: ${ref.src}`);
      continue;
    }

    const imagePath = resolveImagePath(ref);
    if (!imagePath) {
      console.warn(`  ⚠️ 图片未找到: ${ref.src}`);
      continue;
    }

    if (explicitDir && !isWithinDir(imagePath, explicitDir)) {
      continue;
    }

    if (isWebpImage(imagePath)) {
      skippedCount++;
      continue;
    }

    const result = await encodeToWebp(imagePath);

    if (result.success) {
      if (result.skipped) {
        skippedCount++;
      } else {
        const newSrc = replaceExt(ref.src, '.webp');
        content = replaceImageRef(content, ref.src, newSrc);
        changed = true;
        compressedCount++;
        console.log(`  ✅ 压缩: ${path.basename(imagePath)} → ${path.basename(result.outputPath)}`);
      }
    } else {
      errorCount++;
      console.error(`  ❌ 压缩失败: ${imagePath}`, result.error?.message || '');
    }
  }

  let newMdPath = null;
  if (changed) {
    newMdPath = writeNewMarkdown(mdPath, content);
    console.log(`  📝 已生成: ${newMdPath}`);
  }

  return { mdPath, newMdPath, compressedCount, skippedCount, errorCount };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('用法: node compress.mjs <md输入> [图目录]');
    console.error('  <md输入> 支持：单个文件、多个文件、glob、目录');
    process.exit(1);
  }

  const mdInput = args[0];
  const explicitDir = args[1] || null;

  let mdFiles;
  try {
    mdFiles = await resolveMarkdownInputs([mdInput]);
  } catch (error) {
    console.error(`❌ 输入解析失败: ${error.message}`);
    process.exit(1);
  }

  console.log(`\n找到 ${mdFiles.length} 个 Markdown 文件\n`);

  let totalCompressed = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  let totalGenerated = 0;

  for (const mdPath of mdFiles) {
    console.log(`处理: ${mdPath}`);
    const result = await compressMarkdownFile(mdPath, explicitDir);
    totalCompressed += result.compressedCount;
    totalSkipped += result.skippedCount;
    totalErrors += result.errorCount;
    if (result.newMdPath) totalGenerated++;
  }

  console.log('\n处理完成：');
  console.log(`  压缩: ${totalCompressed} 张`);
  console.log(`  跳过: ${totalSkipped} 张（已是 webp 或不支持）`);
  console.log(`  失败: ${totalErrors} 张`);
  console.log(`  生成新文件: ${totalGenerated} 个`);
  console.log(`  原图已备份到各自目录的 backup/ 文件夹`);
}

main().catch((error) => {
  console.error('处理过程中发生错误:', error);
  process.exit(1);
});
