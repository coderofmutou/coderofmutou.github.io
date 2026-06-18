import fs from 'node:fs';
import path from 'node:path';

const ASSET_DIR_NAMES = [
  '.assets',
  '.images',
  '.imgs',
  '.pics',
];

const SHARED_DIR_NAMES = [
  'images',
  'imgs',
  'pics',
];

export const ALL_ASSET_DIR_PATTERNS = [...ASSET_DIR_NAMES, ...SHARED_DIR_NAMES];

export function discoverAssetDir(mdFilePath, explicitDir = null) {
  if (explicitDir) {
    const resolved = path.resolve(explicitDir);
    if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
      return resolved;
    }
    return null;
  }

  const mdDir = path.dirname(mdFilePath);
  const mdStem = path.basename(mdFilePath, '.md');
  const mdStemWithoutPrefix = mdStem.replace(/^\d+\./, '');

  const candidates = new Set();

  for (const suffix of ASSET_DIR_NAMES) {
    candidates.add(path.join(mdDir, `${mdStem}${suffix}`));
    candidates.add(path.join(mdDir, `${mdStemWithoutPrefix}${suffix}`));
  }

  for (const name of SHARED_DIR_NAMES) {
    candidates.add(path.join(mdDir, name));
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      return candidate;
    }
  }

  return null;
}

export function listAssetDirs(mdFilePath) {
  const mdDir = path.dirname(mdFilePath);
  const mdStem = path.basename(mdFilePath, '.md');
  const mdStemWithoutPrefix = mdStem.replace(/^\d+\./, '');
  const found = [];

  const candidates = new Set();
  for (const suffix of ASSET_DIR_NAMES) {
    candidates.add(path.join(mdDir, `${mdStem}${suffix}`));
    candidates.add(path.join(mdDir, `${mdStemWithoutPrefix}${suffix}`));
  }
  for (const name of SHARED_DIR_NAMES) {
    candidates.add(path.join(mdDir, name));
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      found.push(candidate);
    }
  }

  return found;
}
