import fs from 'node:fs';
import path from 'node:path';
import { extractImageReferences } from './lib/extract-image-references.mjs';
import { resolveMarkdownInputs } from './lib/resolve-markdown-inputs.mjs';
import { discoverAssetDir, listAssetDirs, ALL_ASSET_DIR_PATTERNS } from './lib/discover-asset-dir.mjs';

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg']);

function isImageFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return IMAGE_EXTENSIONS.has(ext);
}

function isAssetDir(dirPath) {
  const base = path.basename(dirPath);
  return ALL_ASSET_DIR_PATTERNS.some((pattern) => base.endsWith(pattern));
}

function walkMarkdownFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

function walkImageFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'backup') continue;
      results.push(...walkImageFiles(fullPath));
    } else if (entry.isFile() && isImageFile(fullPath)) {
      results.push(fullPath);
    }
  }
  return results;
}

async function buildReverseIndex(mdFiles) {
  const index = new Map();

  for (const mdPath of mdFiles) {
    try {
      const refs = await extractImageReferences(mdPath, { filterExternal: true });
      for (const ref of refs) {
        const absolutePath = ref.absolutePath;
        if (!absolutePath) continue;

        if (!fs.existsSync(absolutePath)) continue;

        if (!index.has(absolutePath)) {
          index.set(absolutePath, new Set());
        }
        index.get(absolutePath).add(mdPath);
      }
    } catch (error) {
      console.warn(`  ⚠️ 解析失败: ${mdPath} - ${error.message}`);
    }
  }

  return index;
}

async function scanFullRepo(docsRoot) {
  console.log(`扫描 Markdown 文件...`);
  const mdFiles = walkMarkdownFiles(docsRoot);
  console.log(`  找到 ${mdFiles.length} 个 Markdown 文件`);

  console.log(`\n建立图片引用反向索引...`);
  const reverseIndex = await buildReverseIndex(mdFiles);
  const referencedCount = reverseIndex.size;
  console.log(`  被引用的图片: ${referencedCount} 张`);

  console.log(`\n扫描图片文件...`);
  const imageFiles = walkImageFiles(docsRoot).filter((imgPath) => isAssetDir(path.dirname(imgPath)));
  console.log(`  找到 ${imageFiles.length} 张图片`);

  const unused = [];
  const usedOnce = [];
  const usedMultiple = [];

  for (const imgPath of imageFiles) {
    const referrers = reverseIndex.get(imgPath);
    if (!referrers || referrers.size === 0) {
      unused.push(imgPath);
    } else if (referrers.size === 1) {
      usedOnce.push({ imgPath, referrers: [...referrers] });
    } else {
      usedMultiple.push({ imgPath, referrers: [...referrers] });
    }
  }

  console.log('\n========== 扫描报告 ==========');
  console.log(`\n【全仓库未引用（可考虑删除）】共 ${unused.length} 张`);
  for (const imgPath of unused) {
    console.log(`  ${path.relative(docsRoot, imgPath)}`);
  }

  console.log(`\n【仅 1 篇文章引用】共 ${usedOnce.length} 张`);
  for (const { imgPath, referrers } of usedOnce) {
    console.log(`  ${path.relative(docsRoot, imgPath)}`);
    console.log(`    → ${path.relative(docsRoot, referrers[0])}`);
  }

  console.log(`\n【多篇引用】共 ${usedMultiple.length} 张`);
  for (const { imgPath, referrers } of usedMultiple) {
    console.log(`  ${path.relative(docsRoot, imgPath)}`);
    for (const md of referrers) {
      console.log(`    → ${path.relative(docsRoot, md)}`);
    }
  }

  console.log('\n注意：未引用图片建议手动确认后再删除。');
}

async function scanLocal(mdPath, explicitScope) {
  const mdDir = path.dirname(mdPath);
  const refs = await extractImageReferences(mdPath, { filterExternal: true });
  const referencedAbsolutePaths = new Set();
  const referencedDirs = new Set();

  for (const ref of refs) {
    if (ref.isAbsolute) continue;
    if (ref.absolutePath) {
      referencedAbsolutePaths.add(path.resolve(ref.absolutePath));
    }
    referencedDirs.add(path.resolve(ref.mdDir, path.dirname(ref.decoded)));
  }

  const scopeDirs = new Set();
  scopeDirs.add(path.resolve(mdDir));
  for (const dir of referencedDirs) {
    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
      scopeDirs.add(dir);
    }
  }

  if (explicitScope) {
    const resolvedScope = path.resolve(explicitScope);
    if (fs.existsSync(resolvedScope) && fs.statSync(resolvedScope).isDirectory()) {
      scopeDirs.add(resolvedScope);
    }
  }

  const discoveredDirs = listAssetDirs(mdPath);
  for (const dir of discoveredDirs) {
    scopeDirs.add(path.resolve(dir));
  }

  console.log(`\n单篇扫描: ${mdPath}`);
  console.log(`  扫描范围: ${[...scopeDirs].join(', ')}`);
  console.log(`  已引用图片: ${referencedAbsolutePaths.size} 张\n`);

  let unusedCount = 0;

  console.log('【本篇未引用图片】');
  for (const scopeDir of scopeDirs) {
    const imageFiles = walkImageFiles(scopeDir);
    for (const imgPath of imageFiles) {
      if (!referencedAbsolutePaths.has(path.resolve(imgPath))) {
        console.log(`  ${path.relative(mdDir, imgPath)}`);
        unusedCount++;
      }
    }
  }

  if (unusedCount === 0) {
    console.log('  无');
  }

  console.log('\n注意：单篇扫描结果仅供参考，这些图片可能被其他文章引用。');
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('用法: node scan.mjs <docs根目录>');
    console.error('   或: node scan.mjs --local=<md文件> [扫描范围]');
    process.exit(1);
  }

  const firstArg = args[0];

  if (firstArg.startsWith('--local=')) {
    const mdPath = firstArg.slice('--local='.length);
    const explicitScope = args[1] || null;
    await scanLocal(mdPath, explicitScope);
  } else {
    await scanFullRepo(path.resolve(firstArg));
  }
}

main().catch((error) => {
  console.error('处理过程中发生错误:', error);
  process.exit(1);
});
