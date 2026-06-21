import { describe, it } from 'node:test';
import assert from 'node:assert';
import { replaceImageRef } from '../lib/markdown-link.mjs';

describe('replaceImageRef', () => {
  it('replaces simple Markdown image reference', () => {
    const content = '![alt](./images/photo.png)';
    const result = replaceImageRef(content, './images/photo.png', './images/photo.webp');
    assert.strictEqual(result, '![alt](./images/photo.webp)');
  });

  it('replaces URL-encoded Markdown image reference', () => {
    const content = '![图](images/%E5%9F%BA%E7%A1%80.png)';
    const result = replaceImageRef(content, 'images/%E5%9F%BA%E7%A1%80.png', 'images/%E5%9F%BA%E7%A1%80.webp');
    assert.strictEqual(result, '![图](images/%E5%9F%BA%E7%A1%80.webp)');
  });

  it('replaces HTML img src reference', () => {
    const content = '<img src="images/logo.png" alt="logo">';
    const result = replaceImageRef(content, 'images/logo.png', 'images/logo.webp');
    assert.strictEqual(result, '<img src="images/logo.webp" alt="logo">');
  });

  it('does not replace plain text occurrences', () => {
    const content = 'photo.png is the filename. ![alt](./images/photo.png)';
    const result = replaceImageRef(content, './images/photo.png', './images/photo.webp');
    assert.ok(result.includes('photo.png is the filename.'));
    assert.ok(result.includes('![alt](./images/photo.webp)'));
  });

  it('handles paths with parentheses', () => {
    const content = '![图](images/Java从入门到精通(JDK17版)/photo.png)';
    const result = replaceImageRef(content, 'images/Java从入门到精通(JDK17版)/photo.png', 'images/Java从入门到精通(JDK17版)/photo.webp');
    assert.strictEqual(result, '![图](images/Java从入门到精通(JDK17版)/photo.webp)');
  });

  it('replaces both encoded and decoded versions of the same path', () => {
    const content = '![a](images/%E5%9F%BA%E7%A1%80.png) ![b](images/基础.png)';
    const result = replaceImageRef(content, 'images/基础.png', 'images/基础.webp');
    assert.ok(result.includes('images/%E5%9F%BA%E7%A1%80.webp'));
    assert.ok(result.includes('images/基础.webp'));
  });

  it('aligns encoding levels by kind, not by array index', () => {
    // old 含 [raw, encoded, fullEncoded] 三层，new 含 [raw, decoded, encoded] 三层。
    // 若按下标对齐，old 的 encoded 变体会错位映射到 new 的 decoded 变体，
    // 写出带空格的 URL（断链）。应按编码层级对齐。
    const content = '![a](a/b c.png) ![b](a/b%20c.png) ![c](a%2Fb%20c.png)';
    const result = replaceImageRef(content, 'a/b c.png', 'x%20y.png');
    assert.ok(!result.includes('x y.png'), '不应出现解码后带空格的引用');
    assert.ok(result.includes('![a](x%20y.png)'));
    assert.ok(result.includes('![b](x%2520y.png)'));
    assert.ok(result.includes('![c](x%20y.png)'));
  });
});
