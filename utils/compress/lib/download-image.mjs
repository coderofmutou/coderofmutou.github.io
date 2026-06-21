import fs from 'node:fs';
import path from 'node:path';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const INVALID_FILENAME_CHARS = /[<>:"/\\|?*]/g;
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp'];
// 文件名长度上限：超过则视为异常（可能是 data: 或超长动态 URL），改用序号命名。
const MAX_FILENAME_LENGTH = 100;

function extractFilenameFromUrl(url, index) {
  const fallback = `image_${String(index).padStart(3, '0')}`;
  try {
    const parsed = new URL(url);
    const pathname = decodeURIComponent(parsed.pathname);
    const filename = path.basename(pathname);

    if (filename && filename.includes('.') && filename.length <= MAX_FILENAME_LENGTH) {
      return filename.replace(INVALID_FILENAME_CHARS, '_');
    }

    const ext = IMAGE_EXTENSIONS.find((e) => url.toLowerCase().includes(e));
    return `${fallback}${ext || '.png'}`;
  } catch {
    return `${fallback}.png`;
  }
}

function resolveUniqueSavePath(assetsDir, filename, index, reserved) {
  const ext = path.extname(filename);
  const stem = ext ? filename.slice(0, -ext.length) : filename;
  let savePath = path.join(assetsDir, filename);
  let counter = 1;

  // 同时检查磁盘已存在文件和本批次已预占的路径，避免并发下载时
  // 多个相同 basename 的 URL 拿到同一个 savePath 互相覆盖。
  while (fs.existsSync(savePath) || reserved.has(savePath)) {
    savePath = path.join(assetsDir, `${stem}_${String(index).padStart(3, '0')}_${counter}${ext}`);
    counter++;
  }

  reserved.add(savePath);
  return { savePath, filename: path.basename(savePath) };
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

    // 拒绝 HTML 响应：外链图片失效时常返回 200 的 HTML 错误页，
    // 直接保存会得到一个被当成图片的 .html 内容。
    const contentType = response.headers.get('content-type') || '';
    if (contentType.startsWith('text/html')) {
      throw new Error(`响应非图片 (content-type: ${contentType})，可能是错误页`);
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
