import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { resolveMarkdownInputs } from './lib/resolve-markdown-inputs.mjs';
import { resolveNewMarkdownPath } from './lib/markdown-link.mjs';

function runScript(scriptName, args) {
  const scriptPath = path.resolve(import.meta.dirname, scriptName);
  const result = spawnSync(process.execPath, [scriptPath, ...args], { stdio: 'inherit' });
  if (result.error) throw new Error(`无法启动 ${scriptName}: ${result.error.message}`);
  return result.status === 0;
}

function getWorkingPath(mdPath) {
  return mdPath.replace(/\.md$/, '_working.md');
}

function prepareWorkingFile(mdPath) {
  const workingPath = getWorkingPath(mdPath);
  if (fs.existsSync(workingPath)) {
    fs.unlinkSync(workingPath);
  }
  return workingPath;
}

function finalizeWorkingFile(mdPath) {
  const workingPath = getWorkingPath(mdPath);
  if (!fs.existsSync(workingPath)) return null;

  // 若 working 与原文完全一致，说明整条流水线（download + compress）未产生
  // 任何改动，不必产出 _new.md，与独立命令「仅变化才生成」的语义对齐。
  const originalContent = fs.readFileSync(mdPath, 'utf-8');
  const workingContent = fs.readFileSync(workingPath, 'utf-8');
  if (originalContent === workingContent) {
    fs.unlinkSync(workingPath);
    return null;
  }

  const finalPath = resolveNewMarkdownPath(mdPath);
  fs.copyFileSync(workingPath, finalPath);
  fs.unlinkSync(workingPath);
  return finalPath;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('用法: node image-pipeline.mjs <md输入> [assets目录]');
    console.error('  <md输入> 支持：单个文件、多个文件、glob、目录');
    process.exit(1);
  }

  const mdInput = args[0];
  const explicitAssetsDir = args[1] || null;

  let mdFiles;
  try {
    mdFiles = await resolveMarkdownInputs([mdInput]);
  } catch (error) {
    console.error(`❌ 输入解析失败: ${error.message}`);
    process.exit(1);
  }

  console.log(`\n找到 ${mdFiles.length} 个 Markdown 文件\n`);
  console.log('流水线：download → compress → scan --local\n');

  let totalGenerated = 0;

  for (const originalMdPath of mdFiles) {
    console.log(`\n========== ${originalMdPath} ==========`);

    const workingPath = prepareWorkingFile(originalMdPath);

    // Phase 1: download (reads original, writes _new.md if changed)
    const downloadArgs = [originalMdPath];
    if (explicitAssetsDir) downloadArgs.push(explicitAssetsDir);
    const downloadOk = runScript('download.mjs', downloadArgs);
    if (!downloadOk) {
      console.warn(`  ⚠️ download 阶段失败，外链图片可能未被本地化，继续后续步骤`);
    }

    // If download produced _new.md, use it as the working base.
    const downloadNewPath = resolveNewMarkdownPath(originalMdPath);
    if (fs.existsSync(downloadNewPath)) {
      fs.copyFileSync(downloadNewPath, workingPath);
      fs.unlinkSync(downloadNewPath);
    } else {
      fs.copyFileSync(originalMdPath, workingPath);
    }

    // Phase 2: compress (reads/writes _working.md)
    const compressOk = runScript('compress.mjs', [workingPath]);
    if (!compressOk) {
      console.warn(`  ⚠️ compress 阶段失败`);
    }

    // Phase 3: scan local (reads _working.md)
    runScript('scan.mjs', [`--local=${workingPath}`]);

    // Finalize: _working.md -> _new.md
    const finalPath = finalizeWorkingFile(originalMdPath);
    if (finalPath) {
      totalGenerated++;
      console.log(`\n📝 最终输出: ${finalPath}`);
    } else {
      console.log(`\nℹ️ 无需改动，未生成 _new.md`);
    }
  }

  console.log('\n流水线完成。');
  console.log(`  生成新文件: ${totalGenerated} 个`);
  if (totalGenerated > 0) {
    console.log('  请检查 *_new.md 文件，确认无误后手动替换原文件。');
  }
}

main().catch((error) => {
  console.error('处理过程中发生错误:', error);
  process.exit(1);
});
