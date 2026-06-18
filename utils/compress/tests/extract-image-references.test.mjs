import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { extractImageReferences } from '../lib/extract-image-references.mjs';

function createTempMd(content) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-test-'));
  const mdPath = path.join(tmpDir, 'test.md');
  fs.writeFileSync(mdPath, content, 'utf-8');
  return { tmpDir, mdPath };
}

describe('extractImageReferences', () => {
  it('extracts Markdown image references', async () => {
    const { tmpDir, mdPath } = createTempMd(`
![alt text](./image.png)
![another](images/photo.jpg)
`);

    const refs = await extractImageReferences(mdPath);
    const srcs = refs.map((r) => r.src);

    assert.ok(srcs.includes('./image.png'));
    assert.ok(srcs.includes('images/photo.jpg'));

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('extracts HTML img src references', async () => {
    const { tmpDir, mdPath } = createTempMd(`
<img src="images/logo.png" alt="logo" width="200">
<img src='./chart.jpg' alt='chart'>
`);

    const refs = await extractImageReferences(mdPath);
    const srcs = refs.map((r) => r.src);

    assert.ok(srcs.includes('images/logo.png'));
    assert.ok(srcs.includes('./chart.jpg'));

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('decodes URL-encoded paths', async () => {
    const { tmpDir, mdPath } = createTempMd(`
![图](images/%E5%9F%BA%E7%A1%80.png)
`);

    const refs = await extractImageReferences(mdPath);
    assert.strictEqual(refs.length, 1);
    assert.strictEqual(refs[0].src, 'images/%E5%9F%BA%E7%A1%80.png');
    assert.strictEqual(refs[0].decoded, 'images/基础.png');

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('filters external links when filterExternal is true', async () => {
    const { tmpDir, mdPath } = createTempMd(`
![local](./local.png)
![external](https://example.com/image.png)
`);

    const allRefs = await extractImageReferences(mdPath);
    assert.strictEqual(allRefs.length, 2);

    const filteredRefs = await extractImageReferences(mdPath, { filterExternal: true });
    assert.strictEqual(filteredRefs.length, 1);
    assert.strictEqual(filteredRefs[0].src, './local.png');

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('extracts frontmatter image fields', async () => {
    const { tmpDir, mdPath } = createTempMd(`---
title: Test
cover: ./cover.png
banner: /img/banner.jpg
gallery:
  - ./a.png
  - https://external.com/b.png
---

# Hello

![inline](./inline.png)
`);

    const refs = await extractImageReferences(mdPath, { filterExternal: true });
    const srcs = refs.map((r) => r.src);

    assert.ok(srcs.includes('./cover.png'));
    assert.ok(srcs.includes('/img/banner.jpg'));
    assert.ok(srcs.includes('./a.png'));
    assert.ok(srcs.includes('./inline.png'));
    assert.ok(!srcs.includes('https://external.com/b.png'));

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('distinguishes absolute and relative references', async () => {
    const { tmpDir, mdPath } = createTempMd(`
![relative](./images/photo.png)
![absolute](/img/icon.png)
![external](https://example.com/x.png)
`);

    const refs = await extractImageReferences(mdPath);
    const relative = refs.find((r) => r.src === './images/photo.png');
    const absolute = refs.find((r) => r.src === '/img/icon.png');
    const external = refs.find((r) => r.src === 'https://example.com/x.png');

    assert.ok(relative);
    assert.strictEqual(relative.isAbsolute, false);
    assert.strictEqual(relative.isExternal, false);
    assert.ok(relative.absolutePath);

    assert.ok(absolute);
    assert.strictEqual(absolute.isAbsolute, true);
    assert.strictEqual(absolute.isExternal, false);
    assert.strictEqual(absolute.absolutePath, null);

    assert.ok(external);
    assert.strictEqual(external.isExternal, true);
    assert.strictEqual(external.absolutePath, null);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
