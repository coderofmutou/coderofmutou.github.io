import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createPathReserver, downloadToPath } from '../lib/download-image.mjs';

function tempAssetsDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'kb-dl-test-'));
}

describe('createPathReserver', () => {
  it('assigns distinct paths to same-basename URLs (race guard)', () => {
    const assetsDir = tempAssetsDir();
    try {
      const reserve = createPathReserver(assetsDir);
      // 两个不同 URL 但 basename 相同 —— 并发下载竞争的核心场景。
      const a = reserve.reserve('https://a.com/screenshot.png', 1);
      const b = reserve.reserve('https://b.com/screenshot.png', 2);

      assert.notStrictEqual(a.savePath, b.savePath);
      assert.ok(a.filename.endsWith('.png'));
      assert.ok(b.filename.endsWith('.png'));
    } finally {
      fs.rmSync(assetsDir, { recursive: true, force: true });
    }
  });

  it('reserves a stable name when basename is unique', () => {
    const assetsDir = tempAssetsDir();
    try {
      const reserve = createPathReserver(assetsDir);
      const r = reserve.reserve('https://a.com/cover.png', 1);
      assert.strictEqual(path.basename(r.savePath), 'cover.png');
    } finally {
      fs.rmSync(assetsDir, { recursive: true, force: true });
    }
  });

  it('avoids colliding with a file already on disk', () => {
    const assetsDir = tempAssetsDir();
    try {
      fs.writeFileSync(path.join(assetsDir, 'cover.png'), 'x');
      const reserve = createPathReserver(assetsDir);
      const r = reserve.reserve('https://a.com/cover.png', 1);
      assert.notStrictEqual(path.basename(r.savePath), 'cover.png');
    } finally {
      fs.rmSync(assetsDir, { recursive: true, force: true });
    }
  });
});

describe('downloadToPath', () => {
  it('reports failure without throwing on a bad URL', async () => {
    const assetsDir = tempAssetsDir();
    try {
      const result = await downloadToPath(
        'http://127.0.0.1:1/no-such-port.png',
        path.join(assetsDir, 'x.png'),
        'x.png',
      );
      assert.strictEqual(result.success, false);
      assert.ok(result.error);
    } finally {
      fs.rmSync(assetsDir, { recursive: true, force: true });
    }
  });
});
