/**
 * 按围栏代码块（``` 或 ~~~）切分 Markdown 内容。
 *
 * 返回 [{ text, isCode, startLine }]：
 *   - isCode:true 的段是围栏代码块（含围栏行本身），原样保留。
 *   - isCode:false 的段是普通文本，可安全做正则替换。
 *   - startLine 是该段首行在原文中的 0-based 行号，用于报告行号。
 *
 * 遵循 CommonMark：
 *   - 闭合围栏的字符必须与开启相同，长度 >= 开启长度；
 *   - 开启围栏最多 3 个空格缩进。
 * 兼容 CRLF 行尾。
 */
export function splitCodeFences(content) {
  const lines = content.split(/\r?\n/);
  const segments = [];
  let inCode = false;
  let fenceChar = '';
  let fenceLen = 0;
  let buf = [];
  let bufStart = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trimStart();

    if (!inCode) {
      const m = /^ {0,3}(`{3,}|~{3,})/.exec(trimmed);
      if (m) {
        if (buf.length > 0) {
          segments.push({ text: buf.join('\n'), isCode: false, startLine: bufStart });
          buf = [];
        }
        inCode = true;
        fenceChar = m[1][0];
        fenceLen = m[1].length;
        bufStart = i;
        buf.push(line);
      } else {
        if (buf.length === 0) bufStart = i;
        buf.push(line);
      }
    } else {
      buf.push(line);
      const closeM = new RegExp(`^ {0,3}${fenceChar === '`' ? '`' : '~'}{${fenceLen},}[ \\t]*$`).exec(trimmed);
      if (closeM) {
        segments.push({ text: buf.join('\n'), isCode: true, startLine: bufStart });
        buf = [];
        inCode = false;
        fenceChar = '';
        fenceLen = 0;
      }
    }
  }

  if (buf.length > 0) {
    segments.push({ text: buf.join('\n'), isCode: inCode, startLine: bufStart });
  }

  return segments;
}

/**
 * 按原始内容的行尾风格还原处理后文本的换行符。
 *
 * splitCodeFences 用 split(/\r?\n/) 会把 CRLF 统一成 LF，调用方在最终
 * 输出前用此函数还原，避免静默改动 Windows CRLF 文件的行尾。
 * processed 此时为纯 LF（无 \r），可安全把 \n 替换为 \r\n。
 */
export function restoreEol(original, processed) {
  if (!original.includes('\r\n')) return processed;
  return processed.replace(/\n/g, '\r\n');
}

/**
 * 在围栏代码块之外对文本做替换：code 段原样保留，非 code 段经 fn 处理。
 * 无围栏时直接对原文调用 fn，避免 split/join 改动行尾与边界；
 * 有围栏时按段处理后用 restoreEol 还原原始行尾风格。
 */
export function transformOutsideCodeFences(content, fn) {
  const segments = splitCodeFences(content);
  if (segments.length === 1 && !segments[0].isCode) {
    return fn(content);
  }
  return restoreEol(
    content,
    segments.map((seg) => (seg.isCode ? seg.text : fn(seg.text))).join('\n'),
  );
}
