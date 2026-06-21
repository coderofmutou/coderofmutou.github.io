import fs from 'node:fs';
import path from 'node:path';
import { extractImageReferences, MARKDOWN_IMAGE_RE, HTML_IMG_SRC_RE, IMAGE_EXTENSIONS, isAbsoluteLocalSrc } from './lib/extract-image-references.mjs';
import { findMdFiles } from './lib/resolve-markdown-inputs.mjs';
import { listAssetDirs, ALL_ASSET_DIR_PATTERNS } from './lib/discover-asset-dir.mjs';
import { splitCodeFences } from './lib/split-code-fences.mjs';

/**
 * 扫描单个 md 文件，返回所有绝对路径图片引用。
 * 跳过代码块（``` 或 ~~~ 围栏）内的内容——围栏切分复用共享
 * splitCodeFences（遵循 CommonMark 闭合长度规则），不另起一套实现。
 * 绝对路径判定复用 lib 的 isAbsoluteLocalSrc（认 `/` 与 Windows 盘符）。
 *
 * @param {string} mdPath  md 文件绝对路径
 * @returns {{ line: number, src: string, syntax: 'markdown' | 'html' }[]}
 */
function findAbsolutePathRefs(mdPath) {
  if (!fs.existsSync(mdPath)) return [];

  const content = fs.readFileSync(mdPath, 'utf-8');
  const results = [];

  for (const seg of splitCodeFences(content)) {
    if (seg.isCode) continue;
    const segLines = seg.text.split('\n');
    for (let j = 0; j < segLines.length; j++) {
      const lineNum = seg.startLine + j + 1;
      const line = segLines[j];

      // Markdown 语法 ![alt](src)
      for (const m of line.matchAll(MARKDOWN_IMAGE_RE)) {
        const src = m[1].trim();
        if (isAbsoluteLocalSrc(src)) {
          results.push({ line: lineNum, src, syntax: 'markdown' });
        }
      }

      // HTML <img src="...">
      for (const m of line.matchAll(HTML_IMG_SRC_RE)) {
        const src = m[1].trim();
        if (isAbsoluteLocalSrc(src)) {
          results.push({ line: lineNum, src, syntax: 'html' });
        }
      }
    }
  }

  return results;
}

/**
 * 对一批 md 文件执行绝对路径扫描，输出报告节。
 *
 * @param {string[]} mdFiles   md 文件路径数组
 * @param {string}   [baseDir] 用于输出相对路径的根目录（可选）
 */
function reportAbsolutePathRefs(mdFiles, baseDir) {
  console.log('\n【绝对路径图片引用】');

  let totalHits = 0;

  for (const mdPath of mdFiles) {
    const hits = findAbsolutePathRefs(mdPath);
    if (hits.length === 0) continue;

    totalHits += hits.length;
    const displayPath = baseDir ? path.relative(baseDir, mdPath) : mdPath;
    console.log(`  ${displayPath}`);
    for (const { line, src, syntax } of hits) {
      console.log(`    行 ${line} [${syntax}]  ${src}`);
    }
  }

  if (totalHits === 0) {
    console.log('  ℹ️ 无绝对路径图片引用');
  } else {
    console.log(`\n  共发现 ${totalHits} 处绝对路径图片引用，建议改为相对路径。`);
  }
}

function isImageFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return IMAGE_EXTENSIONS.has(ext);
}

function isAssetDir(dirPath) {
  const base = path.basename(dirPath);
  // 用 endsWith 而非 ===：assets 目录约定为 `<篇名>.assets`（如 `10.基础.assets`），
  // 需匹配任意 `.assets` 结尾的目录名，而非仅叫 `.assets`。
  return ALL_ASSET_DIR_PATTERNS.some((pattern) => base.endsWith(pattern));
}

function walkImageFiles(dir, visited = new Set()) {
  const results = [];
  const resolved = path.resolve(dir);
  if (visited.has(resolved)) return results;
  visited.add(resolved);
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'backup') continue;
      results.push(...walkImageFiles(fullPath, visited));
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
  const mdFiles = findMdFiles(docsRoot);
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

  reportAbsolutePathRefs(mdFiles, docsRoot);
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
  // 多个 scopeDir 可能有包含关系（如 explicitScope 覆盖 mdDir），
  // 共享 visited 避免同一棵子树被重复 walk。
  const visited = new Set();
  for (const scopeDir of scopeDirs) {
    const imageFiles = walkImageFiles(scopeDir, visited);
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

  reportAbsolutePathRefs([mdPath]);
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
