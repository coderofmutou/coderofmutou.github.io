import fs from 'node:fs';
import path from 'node:path';

// 实际在用：images（共享目录）；约定推荐：.assets（同篇名 .assets）。
// 其余别名（.images/.imgs/.pics/imgs/pics）经查 docs 下 0 使用，已移除。
const ASSET_DIR_NAMES = ['.assets'];
const SHARED_DIR_NAMES = ['images'];

export const ALL_ASSET_DIR_PATTERNS = [...ASSET_DIR_NAMES, ...SHARED_DIR_NAMES];

// 构造某篇 md 可能对应的 assets 目录候选（按探测优先级）。
// 同时尝试「带序号前缀的篇名」与「去掉序号前缀的篇名」，兼容
// `01.基础.md` 与 `基础.md` 两种命名下的 `.assets` 目录约定。
function buildAssetCandidates(mdFilePath) {
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
  return [...candidates];
}

function existingDirs(candidates) {
  return candidates.filter((c) => fs.existsSync(c) && fs.statSync(c).isDirectory());
}

export function discoverAssetDir(mdFilePath, explicitDir = null) {
  if (explicitDir) {
    const resolved = path.resolve(explicitDir);
    if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
      return resolved;
    }
    return null;
  }
  return existingDirs(buildAssetCandidates(mdFilePath))[0] ?? null;
}

export function listAssetDirs(mdFilePath) {
  return existingDirs(buildAssetCandidates(mdFilePath));
}
