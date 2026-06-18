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
});
