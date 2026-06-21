import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

// 捕获 url，排除可选的 "title"（避免把 `pic.png "示意图"` 整体当 src）
export const MARKDOWN_IMAGE_RE = /!\[[^\]]*\]\(\s*([^)\s"]+)(?:\s+"[^"]*")?\s*\)/g;
export const HTML_IMG_SRC_RE = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;
const EXTERNAL_LINK_RE = /^https?:\/\//i;

export const IMAGE_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.bmp',
  '.webp',
  '.svg',
]);

// 判断 src 是否为本地绝对路径：站内 `/` 开头 或 Windows 盘符路径（C:\ / C:/），
// 排除 http/https 外链。供 scan / convert-html-img / normalize 复用，
// 避免四处各写一份判定（且旧 buildReference 漏判盘符，把 C:\x.png 当相对路径去 resolve）。
export function isAbsoluteLocalSrc(src) {
  if (!src) return false;
  if (EXTERNAL_LINK_RE.test(src)) return false;
  if (src.startsWith('/')) return true;
  if (/^[A-Za-z]:[/\\]/.test(src)) return true;
  return false;
}

function hasImageExtension(value) {
  const lower = value.toLowerCase();
  for (const ext of IMAGE_EXTENSIONS) {
    if (lower.endsWith(ext)) return true;
  }
  return false;
}

function collectFrontmatterImages(frontmatter, images = new Set()) {
  if (!frontmatter || typeof frontmatter !== 'object') return images;

  for (const [key, value] of Object.entries(frontmatter)) {
    if (typeof value === 'string' && hasImageExtension(value)) {
      images.add(value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        if (typeof item === 'string' && hasImageExtension(item)) {
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
  const isAbsolute = isAbsoluteLocalSrc(normalized);

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
