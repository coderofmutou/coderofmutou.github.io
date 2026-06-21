import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const COMPRESSIBLE_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.bmp',
]);

const QUALITY = 75;

export async function encodeToWebp(imagePath, options = {}) {
  const ext = path.extname(imagePath).toLowerCase();
  const backupDirName = options.backupDirName || 'backup';

  if (ext === '.webp') {
    return {
      inputPath: imagePath,
      outputPath: imagePath,
      success: true,
      skipped: true,
      reason: 'already_webp',
    };
  }

  if (!COMPRESSIBLE_EXTENSIONS.has(ext)) {
    return {
      inputPath: imagePath,
      outputPath: imagePath,
      success: false,
      skipped: true,
      reason: 'unsupported_format',
    };
  }

  if (!fs.existsSync(imagePath)) {
    return {
      inputPath: imagePath,
      outputPath: imagePath,
      success: false,
      skipped: true,
      reason: 'not_found',
    };
  }

  const dir = path.dirname(imagePath);
  const baseName = path.basename(imagePath, ext);
  const outputPath = path.join(dir, `${baseName}.webp`);
  const backupDir = path.join(dir, backupDirName);

  try {
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    await sharp(imagePath)
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    const originalName = path.basename(imagePath);
    let backupPath = path.join(backupDir, originalName);
    if (fs.existsSync(backupPath)) {
      const nameWithoutExt = path.basename(originalName, ext);
      backupPath = path.join(backupDir, `${nameWithoutExt}_${Date.now()}${ext}`);
    }
    fs.renameSync(imagePath, backupPath);

    return {
      inputPath: imagePath,
      outputPath,
      backupPath,
      success: true,
      skipped: false,
    };
  } catch (error) {
    return {
      inputPath: imagePath,
      outputPath,
      success: false,
      skipped: false,
      error,
    };
  }
}

export function isWebpImage(imagePath) {
  return path.extname(imagePath).toLowerCase() === '.webp';
}
