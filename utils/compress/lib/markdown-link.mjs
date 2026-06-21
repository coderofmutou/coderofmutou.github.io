import fs from 'node:fs';
import path from 'node:path';
import { transformOutsideCodeFences } from './split-code-fences.mjs';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function decodeURIComponentSafe(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function encodePathPreservingSlash(value) {
  return value
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

// 按"编码层级"枚举 src 的变体，返回 Map<kind, variant>。
// 用 kind 作 key 而非数组下标，保证 old/new 同层级对齐映射——
// 否则当某层级变体缺失时，数组下标会错位，把已编码的旧引用替换成解码的新引用（写出带空格的 URL，断链）。
function getSrcVariants(src) {
  const decoded = decodeURIComponentSafe(src);
  const encoded = encodePathPreservingSlash(src);
  const encodedDecoded = encodePathPreservingSlash(decoded);
  const fullEncoded = encodeURIComponent(src);

  const variants = new Map();
  variants.set('raw', src);
  if (decoded !== src) variants.set('decoded', decoded);
  if (encoded !== src) variants.set('encoded', encoded);
  if (encodedDecoded !== src && encodedDecoded !== decoded && encodedDecoded !== encoded) {
    variants.set('encodedDecoded', encodedDecoded);
  }
  if (fullEncoded !== src && fullEncoded !== encoded) {
    variants.set('fullEncoded', fullEncoded);
  }
  return variants;
}

export function replaceImageRef(content, oldSrc, newSrc) {
  if (oldSrc === newSrc) return content;

  const oldVariants = getSrcVariants(oldSrc);
  const newVariants = getSrcVariants(newSrc);
  const newRaw = newVariants.get('raw');
  const variantMap = new Map();

  // 同层级对齐：old 的每个编码层级变体 → new 的同层级变体；
  // new 缺该层级时退回 new 的原始形式（raw），避免编码层级错位。
  for (const [kind, from] of oldVariants) {
    const to = newVariants.get(kind) ?? newRaw;
    if (from === to) continue;
    variantMap.set(from, to);
  }

  // 对一段文本执行所有变体的图片引用替换
  const replaceInText = (text) => {
    let result = text;
    for (const [from, to] of variantMap.entries()) {
      if (from === to) continue;
      const escaped = escapeRegExp(from);
      const mdRegex = new RegExp(`(!\\[[^\\]]*\\]\\()${escaped}(\\))`, 'g');
      const htmlRegex = new RegExp(`(<img[^>]*src=["'])${escaped}(["'][^>]*>)`, 'gi');
      result = result.replace(mdRegex, `$1${to}$2`);
      result = result.replace(htmlRegex, `$1${to}$2`);
    }
    return result;
  };

  // 跳过围栏代码块内的图片引用，避免改动代码示例；行尾风格由 helper 还原。
  return transformOutsideCodeFences(content, replaceInText);
}

export function writeNewMarkdown(mdPath, newContent) {
  const newPath = mdPath.replace(/\.md$/i, '_new.md');
  fs.writeFileSync(newPath, newContent, 'utf-8');
  return newPath;
}

export function resolveNewMarkdownPath(mdPath) {
  return mdPath.replace(/\.md$/i, '_new.md');
}
