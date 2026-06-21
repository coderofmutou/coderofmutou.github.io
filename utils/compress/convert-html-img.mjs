import fs from 'node:fs';
import { resolveMarkdownInputs } from './lib/resolve-markdown-inputs.mjs';
import { writeNewMarkdown } from './lib/markdown-link.mjs';
import { transformOutsideCodeFences } from './lib/split-code-fences.mjs';
import { isAbsoluteLocalSrc } from './lib/extract-image-references.mjs';

// 匹配完整 <img ...> 标签（单行，不跨行）
const IMG_TAG_RE = /<img\s([^>]*)>/gi;

// 从属性串中提取指定属性值（支持单/双引号，忽略大小写）
function parseAttr(attrs, name) {
  const m = attrs.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'));
  return m ? m[1] : null;
}

// 判断标签属性串里是否有非标准属性（教学示例特征）
function hasNonStandardAttrs(attrs) {
  // data-* 属性：教学示例或已处理
  if (/\bdata-[a-z]/i.test(attrs)) return true;
  // width/height 数值属性：通常是刻意控制尺寸的示例代码
  if (/\b(width|height)\s*=\s*["']?\d/i.test(attrs)) return true;
  return false;
}

// 代码块切分使用共享的 lib/split-code-fences.mjs（正确处理闭合长度 ≥ 开启长度）。
// 旧实现用 FENCE_RE 的 \1 反向引用 + 回溯，会把 4 反引号开围栏误当 3 反引号，
// 导致代码块在 3 反引号处提前闭合，正文里的 <img> 被误转换。

function convertImgTags(content) {
  let changed = false;
  const convertSegment = (text) =>
    text.replace(IMG_TAG_RE, (fullMatch, attrs) => {
      const src = parseAttr(attrs, 'src');
      // 只转换本地相对路径：外链与绝对路径（/开头、Windows 盘符）交给 VuePress 自己处理。
      if (isAbsoluteLocalSrc(src)) return fullMatch;
      if (hasNonStandardAttrs(attrs)) return fullMatch;

      const alt = parseAttr(attrs, 'alt') || '';
      changed = true;
      return `![${alt}](${src})`;
    });

  // 跳过围栏代码块内的 <img>；行尾风格由 helper 还原。
  const result = transformOutsideCodeFences(content, convertSegment);
  return { result, changed };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('用法: node convert-html-img.mjs <md输入>');
    console.error('  <md输入> 支持：单个文件、目录、glob');
    process.exit(1);
  }

  let mdFiles;
  try {
    mdFiles = await resolveMarkdownInputs([args[0]]);
  } catch (err) {
    console.error(`❌ 输入解析失败: ${err.message}`);
    process.exit(1);
  }

  console.log(`\n找到 ${mdFiles.length} 个 Markdown 文件\n`);

  let totalConverted = 0;

  for (const mdPath of mdFiles) {
    const content = fs.readFileSync(mdPath, 'utf-8');
    const { result, changed } = convertImgTags(content);

    if (!changed) {
      console.log(`  ⏭  无需转换: ${mdPath}`);
      continue;
    }

    const outPath = writeNewMarkdown(mdPath, result);
    totalConverted++;
    console.log(`  ✅ 已转换: ${outPath}`);
  }

  console.log(`\n完成。转换了 ${totalConverted} 个文件。`);
  if (totalConverted > 0) {
    console.log('请检查 *_new.md，确认无误后手动替换原文件。');
  }
}

main().catch((err) => {
  console.error('处理过程中发生错误:', err);
  process.exit(1);
});
