import { describe, it } from 'node:test';
import assert from 'node:assert';
import { checkFile, fixContent } from '../normalize.mjs';

const has = (issues, type) => issues.some((i) => i.type === type);

describe('checkFile', () => {
  it('检测无序列表符号后缺空格', () => {
    assert.ok(has(checkFile('-foo\n'), 'list-no-space'));
  });

  it('不误报 thematic break ---', () => {
    assert.ok(!has(checkFile('---\n'), 'list-no-space'));
  });

  it('检测有序列表缺空格，不误报小数/版本号', () => {
    assert.ok(has(checkFile('1.foo\n'), 'list-no-space'));
    assert.ok(!has(checkFile('1.0\n'), 'list-no-space'));
    assert.ok(!has(checkFile('v1.2\n'), 'list-no-space'));
  });

  it('检测标题前后缺空行', () => {
    assert.ok(has(checkFile('text\n## 标题\ntext\n'), 'heading-spacing'));
  });

  it('检测多个 H1', () => {
    assert.ok(has(checkFile('# A\n\n# B\n'), 'multiple-h1'));
  });

  it('检测绝对路径图片', () => {
    assert.ok(has(checkFile('![](C:/x.png)\n'), 'absolute-image-path'));
    assert.ok(has(checkFile('![](/img/x.png)\n'), 'absolute-image-path'));
  });

  it('代码块内列表/标题不被误报', () => {
    const content = '```\n-foo\n## 标题\n```\n';
    const issues = checkFile(content);
    assert.ok(!has(issues, 'list-no-space'));
    assert.ok(!has(issues, 'heading-spacing'));
  });

  it('代码块内 `# ` 注释行不被误报为多余 H1', () => {
    const content = '# 标题\n\n```bash\n# 查看本地镜像\ndocker images\n```\n';
    assert.ok(!has(checkFile(content), 'multiple-h1'));
  });

  it('4 反引号围栏内的 3 反引号不提前闭合', () => {
    // 回归点：旧实现会把 4 反引号当 3 反引号，导致围栏在内部 ``` 处提前闭合
    const content = '````\n```\n-foo\n````\n';
    assert.ok(!has(checkFile(content), 'list-no-space'));
  });
});

describe('fixContent', () => {
  it('列表符号后补空格', () => {
    assert.strictEqual(fixContent('-foo\n'), '- foo\n');
  });

  it('有序列表补空格', () => {
    assert.strictEqual(fixContent('1.bar\n'), '1. bar\n');
  });

  it('标题前后补空行', () => {
    const fixed = fixContent('text\n## T\ntext\n');
    assert.ok(fixed.includes('text\n\n## T\n\ntext'));
  });

  it('压缩超过 2 个连续空行为 2 个', () => {
    const fixed = fixContent('a\n\n\n\n\nb\n');
    assert.ok(!fixed.includes('a\n\n\n\n'));
  });

  it('无问题时返回 null', () => {
    assert.strictEqual(fixContent('## T\n\n正文\n'), null);
  });

  it('围栏代码块完整保留', () => {
    const content = '```js\nconst x = 1;\n```\n';
    assert.strictEqual(fixContent(content), null);
  });

  it('代码块内列表符号不被修改', () => {
    assert.strictEqual(fixContent('```\n-foo\n```\n'), null);
  });

  it('CRLF 行尾保留', () => {
    assert.strictEqual(fixContent('-foo\r\n'), '- foo\r\n');
  });

  it('4 反引号围栏完整保留', () => {
    assert.strictEqual(fixContent('````\n```\ncode\n```\n````\n'), null);
  });

  it('正文与代码块交界处的空行不被吞掉', () => {
    const content = '```js\nx\n```\n\n正文\n';
    const fixed = fixContent(content);
    // 代码块与正文之间应保留空行
    assert.ok(fixed === null || fixed.includes('```\n\n正文'));
  });
});
