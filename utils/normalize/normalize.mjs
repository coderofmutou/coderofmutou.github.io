/**
 * normalize.mjs — Markdown 文档结构归一化工具
 *
 * 用法：
 *   node normalize.mjs check <md输入>   # 只报告，不修改文件
 *   node normalize.mjs fix   <md输入>   # fix 可自动化的问题，输出 *_new.md
 *
 * <md输入> 支持：单个文件、目录（递归）、glob（**\/*.md）
 */

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolveMarkdownInputs } from '../compress/lib/resolve-markdown-inputs.mjs';
import { splitCodeFences, restoreEol } from '../compress/lib/split-code-fences.mjs';
import { MARKDOWN_IMAGE_RE, isAbsoluteLocalSrc } from '../compress/lib/extract-image-references.mjs';
import { resolveNewMarkdownPath } from '../compress/lib/markdown-link.mjs';

// 代码块切分复用共享 lib/split-code-fences.mjs 的 splitCodeFences
// （返回 { text, isCode, startLine }，遵循 CommonMark 闭合长度规则）。

// 列表项「符号后缺空格」判定/修复共用同一组正则：
//   - 无序列表：`-` 后紧跟非空格、非 `-` 字符（排除 `---` 等 thematic break）
//   - 有序列表：`数字.` 后紧跟非空格、非数字、非点号字符（排除小数/日期/版本号）
// 捕获组 ($1 缩进, $2 符号) 兼顾 check 的 test 与 fix 的 replace，避免两处各写一份。
const UNORDERED_LIST_RE = /^(\s*)(-)(?=[^\s-])/;
const ORDERED_LIST_RE = /^(\s*)(\d+\.)(?=[^\s\d.])/;

// ─── 检查逻辑 ─────────────────────────────────────────────────────────────────

/**
 * 检查单个文件，返回 issues 数组。
 * issue: { line: number, type: string, message: string }
 */
export function checkFile(content) {
  const issues = [];
  const segments = splitCodeFences(content);
  const lines = content.split('\n');

  // 非代码块部分一次遍历完成：连续空行 + 列表空格 + 标题空行 + 绝对路径图片。
  // 作用域与 fixContent 对齐（只在 segment 内检测），避免 check 报告而 fix 修不掉的假阳性。
  for (const seg of segments) {
    if (seg.isCode) continue;

    const segLines = seg.text.split('\n');
    let emptyCount = 0;

    for (let j = 0; j < segLines.length; j++) {
      const globalLineNo = seg.startLine + j + 1; // 1-based
      const line = segLines[j];

      // --- 连续空行压缩（>2 个连续空行）---
      if (line.trim() === '') {
        emptyCount++;
        if (emptyCount > 2) {
          issues.push({ line: globalLineNo, type: 'consecutive-blank-lines', message: `第 ${globalLineNo} 行：连续空行超过 2 个` });
        }
      } else {
        emptyCount = 0;
      }

      // --- 列表符号后缺空格 ---
      // 仅处理 `-`（最常用列表标记），不处理 `*`/`+`，以免误伤 `*emphasis*` 行内强调。
      if (UNORDERED_LIST_RE.test(line)) {
        issues.push({ line: globalLineNo, type: 'list-no-space', message: `第 ${globalLineNo} 行：列表符号后缺少空格` });
      }
      // 有序列表：`数字.` 紧跟非空格、非数字、非点号字符（排除小数/日期/版本号）。
      if (ORDERED_LIST_RE.test(line)) {
        issues.push({ line: globalLineNo, type: 'list-no-space', message: `第 ${globalLineNo} 行：有序列表符号后缺少空格` });
      }

      // --- 标题上下空行（只报告） ---
      // 与 fixSegment 作用域对齐：仅看 segment 内相邻行，segment 首行标题视为无前驱（fix 同样不跨 segment 补空行）。
      if (/^#{1,6}\s/.test(line)) {
        const prevLine = j > 0 ? segLines[j - 1] : null;
        const nextLine = j < segLines.length - 1 ? segLines[j + 1] : null;

        const isFirstLine = globalLineNo === 1;
        if (!isFirstLine && prevLine !== null && prevLine.trim() !== '') {
          issues.push({ line: globalLineNo, type: 'heading-spacing', message: `第 ${globalLineNo} 行：标题前缺少空行` });
        }
        if (nextLine !== null && nextLine.trim() !== '') {
          issues.push({ line: globalLineNo, type: 'heading-spacing', message: `第 ${globalLineNo} 行：标题后缺少空行` });
        }
      }

      // --- 绝对路径图片（只报告） ---
      // 图片引用解析与绝对路径判定复用 lib（与 scan/convert 同一来源）。
      for (const m of line.matchAll(MARKDOWN_IMAGE_RE)) {
        const src = m[1].trim();
        if (isAbsoluteLocalSrc(src)) {
          issues.push({ line: globalLineNo, type: 'absolute-image-path', message: `第 ${globalLineNo} 行：图片使用绝对路径 "${src}"` });
        }
      }
    }
  }

  // --- H1 唯一性（只报告） ---
  const h1Lines = lines
    .map((l, i) => ({ line: i + 1, content: l }))
    .filter(({ content }) => /^#\s/.test(content));
  if (h1Lines.length > 1) {
    issues.push({
      line: h1Lines[1].line,
      type: 'multiple-h1',
      message: `文件包含多个 H1 标题（共 ${h1Lines.length} 个），首次出现在第 ${h1Lines[0].line} 行，第二次出现在第 ${h1Lines[1].line} 行`,
    });
  }

  return issues;
}

// ─── 修复逻辑 ─────────────────────────────────────────────────────────────────

/**
 * 修复内容，返回修复后的字符串（null 表示无需修改）。
 */
export function fixContent(content) {
  const segments = splitCodeFences(content);

  // 对每个非代码块 segment 分别处理，然后拼接回来。
  // 压缩空行也在 segment 内部完成，避免再次切分时丢失 segment 边界。
  const processedSegments = segments.map((seg) => {
    if (seg.isCode) return seg.text;
    let text = fixSegment(seg.text, seg.startLine === 0);
    text = compressBlankLines(text);
    return text;
  });

  // 段之间用 '\n' 拼接：splitByCodeFence 用 split(/\r?\n/) 切行，每个 segment
  // 的 buf.join('\n') 只在自身行间补换行，相邻 segment 之间会少一个换行符。
  // 早期用 join('') 会吞掉代码块与正文之间的空行，破坏文档结构。
  const fixed = processedSegments.join('\n');
  const restored = restoreEol(content, fixed);
  return restored === content ? null : restored;
}

/**
 * 压缩单个普通 segment 中超过 2 个的连续空行为 2 个。
 */
function compressBlankLines(text) {
  return text.replace(/(\r?\n\s*){3,}\r?\n/g, '\n\n\n');
}

/**
 * 处理单个非代码块 segment（修复列表空格 + 标题前后空行）。
 * isFirstSegment：该 segment 是否从文件第 0 行开始。
 */
function fixSegment(text, isFirstSegment) {
  let lines = text.split('\n');

  // Fix 2：列表符号后补空格（与 check 规则保持一致：仅 `-`，排除 `---`/小数/日期）
  lines = lines.map((line) => {
    line = line.replace(UNORDERED_LIST_RE, '$1$2 ');
    line = line.replace(ORDERED_LIST_RE, '$1$2 ');
    return line;
  });

  // Fix 3：标题上下各保留一个空行
  // 先做一次插行处理
  const result = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isHeading = /^#{1,6}\s/.test(line);

    if (isHeading) {
      // 标题前空行：当前行不是第一行（整个文件层面）
      const isFileFirstLine = isFirstSegment && i === 0;
      if (!isFileFirstLine) {
        const prevLine = result[result.length - 1];
        if (prevLine !== undefined && prevLine.trim() !== '') {
          result.push('');
        }
      }

      result.push(line);

      // 标题后空行
      const nextLine = lines[i + 1];
      if (nextLine !== undefined && nextLine.trim() !== '') {
        result.push('');
      }
    } else {
      result.push(line);
    }
  }

  return result.join('\n');
}

// ─── CLI 入口 ─────────────────────────────────────────────────────────────────

async function main() {
  const [, , command, ...rest] = process.argv;

  if (!command || !['check', 'fix'].includes(command)) {
    console.error('用法：node normalize.mjs <check|fix> <md输入>');
    console.error('  check  只报告问题，不修改文件');
    console.error('  fix    修复可自动化的问题，输出 *_new.md');
    process.exit(1);
  }

  if (rest.length === 0) {
    console.error('错误：请提供 <md输入>（文件、目录或 glob）');
    process.exit(1);
  }

  let files;
  try {
    files = await resolveMarkdownInputs(rest, process.cwd());
  } catch (err) {
    console.error(`错误：${err.message}`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.log('未找到任何 Markdown 文件。');
    return;
  }

  let totalIssues = 0;

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');

    if (command === 'check') {
      const issues = checkFile(content);
      if (issues.length > 0) {
        console.log(`\n[${filePath}]`);
        for (const issue of issues) {
          console.log(`  ${issue.message}`);
        }
        totalIssues += issues.length;
      } else {
        console.log(`[${filePath}]  ✓ 无问题`);
      }
    } else {
      // fix 模式
      const fixed = fixContent(content);
      if (fixed === null) {
        console.log(`ℹ️  无需修改：${filePath}`);
      } else {
        const outPath = resolveNewMarkdownPath(filePath);
        fs.writeFileSync(outPath, fixed, 'utf8');
        console.log(`✅ 已输出：${outPath}`);
      }
    }
  }

  if (command === 'check') {
    console.log(`\n共扫描 ${files.length} 个文件，发现 ${totalIssues} 个问题。`);
    if (totalIssues > 0) process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error('Fatal:', err);
    process.exit(1);
  });
}
