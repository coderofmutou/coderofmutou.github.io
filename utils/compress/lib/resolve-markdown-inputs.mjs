import fs from 'node:fs';
import path from 'node:path';

function normalizePath(input) {
  return path.normalize(input).replace(/\\/g, '/');
}

function matchesGlob(filePath, pattern) {
  const normalizedFile = normalizePath(filePath);
  const normalizedPattern = normalizePath(pattern);

  // 先转义所有 regex 元字符（保留 * 与 ? 作为 glob 通配符），
  // 再还原 glob 语义，避免文件名中的 ( ) [ ] . 等被当成 regex 元字符。
  const regexPattern = normalizedPattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\?/g, '.') // glob 单字符通配符（先于 **/ 处理，避免误伤正则量词 ?）
    .replace(/\*\*\//g, '(?:.*/)?') // **/ 匹配零或多层目录（含根层）
    .replace(/\*\*/g, '.*') // 裸 ** 匹配任意字符（含 /）
    .replace(/\*/g, '[^/]*');

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(normalizedFile);
}

function isGlobPattern(input) {
  return input.includes('*') || input.includes('?');
}

export function findMdFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMdFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }

  return results;
}

function expandGlob(pattern, cwd = process.cwd()) {
  const results = [];
  const normalizedPattern = normalizePath(pattern);

  // Determine search root
  let searchRoot = cwd;
  let relativePattern = normalizedPattern;

  const parts = normalizedPattern.split('/');
  const rootIndex = parts.findIndex((p) => isGlobPattern(p));

  if (rootIndex > 0) {
    const rootParts = parts.slice(0, rootIndex);
    searchRoot = path.resolve(cwd, rootParts.join('/'));
    relativePattern = parts.slice(rootIndex).join('/');
  }

  if (!fs.existsSync(searchRoot)) {
    return results;
  }

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = normalizePath(path.relative(searchRoot, fullPath));

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && matchesGlob(relativePath, relativePattern)) {
        results.push(fullPath);
      }
    }
  }

  walk(searchRoot);
  return results;
}

export async function resolveMarkdownInputs(inputs, cwd = process.cwd()) {
  if (!inputs || (Array.isArray(inputs) && inputs.length === 0)) {
    throw new Error('No input provided. Provide a file path, directory, or glob pattern.');
  }

  const rawInputs = Array.isArray(inputs) ? inputs : [inputs];
  const results = [];

  for (const rawInput of rawInputs) {
    const input = rawInput.trim();
    if (!input) continue;

    const resolvedPath = path.resolve(cwd, input);

    if (isGlobPattern(input)) {
      const files = expandGlob(resolvedPath, cwd);
      if (files.length === 0) {
        throw new Error(`No files matched glob pattern: ${input}`);
      }
      results.push(...files);
    } else if (fs.existsSync(resolvedPath)) {
      const stat = fs.statSync(resolvedPath);
      if (stat.isDirectory()) {
        const mdFiles = findMdFiles(resolvedPath);
        results.push(...mdFiles);
      } else if (stat.isFile() && resolvedPath.endsWith('.md')) {
        results.push(resolvedPath);
      } else {
        throw new Error(`Not a markdown file: ${input}`);
      }
    } else {
      throw new Error(`Path not found: ${input}`);
    }
  }

  // Deduplicate
  const unique = [...new Set(results.map((p) => path.resolve(p)))];
  return unique;
}
