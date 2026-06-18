import fs from 'node:fs';
import path from 'node:path';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const INVALID_FILENAME_CHARS = /[<>:"/\\|?*]/g;
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp'];

function extractFilenameFromUrl(url, index) {
  try {
    const parsed = new URL(url);
    let pathname = decodeURIComponent(parsed.pathname);
    let filename = path.basename(pathname);

    if (filename && filename.includes('.') && filename.length <= 100) {
      filename = filename.replace(INVALID_FILENAME_CHARS, '_');
      return filename;
    }

    for (const ext of IMAGE_EXTENSIONS) {
      if (url.toLowerCase().includes(ext)) {
        return `image_${String(index).padStart(3, '0')}${ext}`;
      }
    }

    return `image_${String(index).padStart(3, '0')}.png`;
  } catch {
    return `image_${String(index).padStart(3, '0')}.png`;
  }
}

function resolveUniqueSavePath(assetsDir, filename, index, reserved) {
  const ext = path.extname(filename);
  const stem = ext ? filename.slice(0, -ext.length) : filename;
  let candidate = filename;
  let savePath = path.join(assetsDir, candidate);
  let counter = 1;

  // 同时检查磁盘已存在文件和本批次已预占的路径，避免并发下载时
  // 多个相同 basename 的 URL 拿到同一个 savePath 互相覆盖。
  while (fs.existsSync(savePath) || reserved.has(savePath)) {
    candidate = `${stem}_${String(index).padStart(3, '0')}_${counter}${ext}`;
    savePath = path.join(assetsDir, candidate);
    counter++;
  }

  reserved.add(savePath);
  return { savePath, filename: candidate };
}

/**
 * 创建一个本批次专用的路径预占器。必须在所有下载开始前**串行**调用
 * reserve() 预占好唯一路径，再并发执行下载，从而规避 existsSync 的 TOCTOU 竞争。
 */
export function createPathReserver(assetsDir) {
  const reserved = new Set();
  return {
    reserve(url, index) {
      const filename = extractFilenameFromUrl(url, index);
      return resolveUniqueSavePath(assetsDir, filename, index, reserved);
    },
  };
}

export async function downloadToPath(url, savePath, filename) {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(savePath, Buffer.from(buffer));

    return {
      url,
      savedPath: savePath,
      filename,
      success: true,
    };
  } catch (error) {
    return {
      url,
      savedPath: savePath,
      filename,
      success: false,
      error,
    };
  }
}

export function isExternalUrl(src) {
  return /^https?:\/\//i.test(src);
}
