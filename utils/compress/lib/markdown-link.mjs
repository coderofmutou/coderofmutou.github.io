import fs from 'node:fs';
import path from 'node:path';

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

function getSrcVariants(src) {
  const variants = new Set();
  variants.add(src);

  const decoded = decodeURIComponentSafe(src);
  if (decoded !== src) {
    variants.add(decoded);
  }

  const encoded = encodePathPreservingSlash(src);
  if (encoded !== src) {
    variants.add(encoded);
  }

  const encodedDecoded = encodePathPreservingSlash(decoded);
  if (encodedDecoded !== src && encodedDecoded !== decoded && encodedDecoded !== encoded) {
    variants.add(encodedDecoded);
  }

  const fullEncoded = encodeURIComponent(src);
  if (fullEncoded !== src) {
    variants.add(fullEncoded);
  }

  return [...variants];
}

export function replaceImageRef(content, oldSrc, newSrc) {
  if (oldSrc === newSrc) return content;

  let result = content;

  const oldVariants = getSrcVariants(oldSrc);
  const newVariants = getSrcVariants(newSrc);
  const variantMap = new Map();

  for (let i = 0; i < oldVariants.length; i++) {
    const from = oldVariants[i];
    const to = newVariants[i] || newVariants[newVariants.length - 1];
    if (!variantMap.has(from) || variantMap.get(from).length > to.length) {
      variantMap.set(from, to);
    }
  }

  for (const [from, to] of variantMap.entries()) {
    if (from === to) continue;
    const escaped = escapeRegExp(from);
    const mdRegex = new RegExp(`(!\\[[^\\]]*\\]\\()${escaped}(\\))`, 'g');
    const htmlRegex = new RegExp(`(<img[^>]*src=["'])${escaped}(["'][^>]*>)`, 'gi');
    result = result.replace(mdRegex, `$1${to}$2`);
    result = result.replace(htmlRegex, `$1${to}$2`);
  }

  return result;
}

export function writeNewMarkdown(mdPath, newContent) {
  // If the input is a working file (used by image-pipeline.mjs), overwrite it in place
  // so that chained commands operate on the same file.
  if (mdPath.endsWith('_working.md')) {
    fs.writeFileSync(mdPath, newContent, 'utf-8');
    return mdPath;
  }

  const newPath = mdPath.replace(/\.md$/, '_new.md');
  fs.writeFileSync(newPath, newContent, 'utf-8');
  return newPath;
}

export function hasNewMarkdownFile(mdPath) {
  const newPath = mdPath.replace(/\.md$/, '_new.md');
  return fs.existsSync(newPath);
}

export function resolveNewMarkdownPath(mdPath) {
  return mdPath.replace(/\.md$/, '_new.md');
}
