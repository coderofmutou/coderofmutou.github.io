import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { resolveMarkdownInputs } from '../lib/resolve-markdown-inputs.mjs';

function createTempStructure() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-resolve-'));
  const docsDir = path.join(tmpDir, 'docs');
  fs.mkdirSync(path.join(docsDir, '01.Java'), { recursive: true });
  fs.mkdirSync(path.join(docsDir, '02.Web'), { recursive: true });
  fs.writeFileSync(path.join(docsDir, '01.Java', '基础.md'), '# 基础', 'utf-8');
  fs.writeFileSync(path.join(docsDir, '01.Java', '进阶.md'), '# 进阶', 'utf-8');
  fs.writeFileSync(path.join(docsDir, '02.Web', 'HTML.md'), '# HTML', 'utf-8');
  fs.writeFileSync(path.join(docsDir, 'notes.txt'), 'not md', 'utf-8');
  return { tmpDir, docsDir };
}

describe('resolveMarkdownInputs', () => {
  it('resolves a single markdown file', async () => {
    const { tmpDir, docsDir } = createTempStructure();
    const mdPath = path.join(docsDir, '01.Java', '基础.md');
    const result = await resolveMarkdownInputs([mdPath], tmpDir);
    assert.deepStrictEqual(result, [mdPath]);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('resolves multiple markdown files', async () => {
    const { tmpDir, docsDir } = createTempStructure();
    const md1 = path.join(docsDir, '01.Java', '基础.md');
    const md2 = path.join(docsDir, '02.Web', 'HTML.md');
    const result = await resolveMarkdownInputs([md1, md2], tmpDir);
    assert.deepStrictEqual(result.sort(), [md1, md2].sort());
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('resolves a directory recursively', async () => {
    const { tmpDir, docsDir } = createTempStructure();
    const result = await resolveMarkdownInputs([docsDir], tmpDir);
    assert.strictEqual(result.length, 3);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('expands glob patterns', async () => {
    const { tmpDir, docsDir } = createTempStructure();
    const result = await resolveMarkdownInputs([path.join(docsDir, '**', '*.md')], tmpDir);
    assert.strictEqual(result.length, 3);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('throws on non-existent path', async () => {
    const { tmpDir } = createTempStructure();
    await assert.rejects(
      resolveMarkdownInputs([path.join(tmpDir, 'non-existent.md')], tmpDir),
      /Path not found/
    );
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('throws when no files match glob', async () => {
    const { tmpDir, docsDir } = createTempStructure();
    await assert.rejects(
      resolveMarkdownInputs([path.join(docsDir, '**', '*.nonexistent')], tmpDir),
      /No files matched glob pattern/
    );
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('matches filenames containing regex metacharacters via glob', async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-glob-meta-'));
    const subDir = path.join(tmpDir, 'docs');
    fs.mkdirSync(subDir, { recursive: true });
    // 文件名含 ( ) 与 . —— 未转义时会破坏生成的 regex。
    const tricky = path.join(subDir, 'Java(JDK17).md');
    fs.writeFileSync(tricky, '# tricky', 'utf-8');
    fs.writeFileSync(path.join(subDir, 'plain.md'), '# plain', 'utf-8');

    const result = await resolveMarkdownInputs([path.join(subDir, '*.md')], tmpDir);
    assert.ok(result.includes(tricky));
    assert.strictEqual(result.length, 2);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
