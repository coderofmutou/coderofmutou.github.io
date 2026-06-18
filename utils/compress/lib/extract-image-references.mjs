import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const MARKDOWN_IMAGE_RE = /!\[[^\]]*\]\(([^)]+)\)/g;
const HTML_IMG_SRC_RE = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;
const EXTERNAL_LINK_RE = /^https?:\/\//i;

const IMAGE_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.bmp',
  '.webp',
  '.svg',
]);

function hasImageExtension(value) {
  const lower = value.toLowerCase();
  for (const ext of IMAGE_EXTENSIONS) {
    if (lower.endsWith(ext)) return true;
  }
  return false;
}

function isImageLike(value) {
  if (typeof value !== 'string' || value.length === 0) return false;
  // frontmatter 字段只有带图片扩展名才视为图片，避免把 source/link 等
  // 普通 http 链接误当成外链图片去下载（正文 ![]() 与 <img> 不走此判定）。
  return hasImageExtension(value);
}

function collectFrontmatterImages(frontmatter, images = new Set()) {
  if (!frontmatter || typeof frontmatter !== 'object') return images;

  for (const [key, value] of Object.entries(frontmatter)) {
    if (typeof value === 'string' && isImageLike(value)) {
      images.add(value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        if (typeof item === 'string' && isImageLike(item)) {
          images.add(item);
        } else if (typeof item === 'object' && item !== null) {
          collectFrontmatterImages(item, images);
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      collectFrontmatterImages(value, images);
    }
  }

  return images;
}

function decodeSrc(src) {
  try {
    return decodeURIComponent(src);
  } catch {
    return src;
  }
}

function normalizeSrc(src) {
  return src.replace(/\\/g, '/').trim();
}

function buildReference(src, mdDir) {
  const normalized = normalizeSrc(src);
  const decoded = decodeSrc(normalized);
  const isExternal = EXTERNAL_LINK_RE.test(normalized);
  const isAbsolute = !isExternal && normalized.startsWith('/');

  let absolutePath = null;
  if (!isExternal && !isAbsolute) {
    absolutePath = path.resolve(mdDir, decoded);
  }

  return {
    src: normalized,
    decoded,
    isExternal,
    isAbsolute,
    mdDir,
    absolutePath,
  };
}

export async function extractImageReferences(mdFilePath, options = {}) {
  if (!fs.existsSync(mdFilePath)) {
    throw new Error(`Markdown file not found: ${mdFilePath}`);
  }

  const mdDir = path.dirname(mdFilePath);
  const content = fs.readFileSync(mdFilePath, 'utf-8');
  const { data: frontmatter } = matter(content);

  const rawRefs = new Set();

  // Markdown image syntax: ![alt](src)
  for (const match of content.matchAll(MARKDOWN_IMAGE_RE)) {
    rawRefs.add(match[1]);
  }

  // HTML img tag: <img src="...">
  for (const match of content.matchAll(HTML_IMG_SRC_RE)) {
    rawRefs.add(match[1]);
  }

  // Frontmatter image fields
  collectFrontmatterImages(frontmatter).forEach((src) => rawRefs.add(src));

  const refs = [];
  const seen = new Set();
  for (const src of rawRefs) {
    const ref = buildReference(src, mdDir);
    if (options.filterExternal && ref.isExternal) continue;
    const key = `${ref.mdDir}::${ref.decoded}`;
    if (seen.has(key)) continue;
    seen.add(key);
    refs.push(ref);
  }

  return refs;
}

export function isExternalReference(src) {
  return EXTERNAL_LINK_RE.test(src);
}

export function isAbsoluteReference(src) {
  return !isExternalReference(src) && src.startsWith('/');
}

export function isRelativeReference(src) {
  return !isExternalReference(src) && !isAbsoluteReference(src);
}
