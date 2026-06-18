/*
功能概述：检索未在Markdown文件中使用的图片文件夹中的图片
    node search-unused-images2.js ./目标目录
    需要目标目录中图片文件夹名 = markdown文件名 + .assets
 */
const fs = require('fs');
const path = require('path');

function getFilesInDir(dir) {
  return fs.readdirSync(dir).map(file => path.join(dir, file));
}

function isMarkdownFile(file) {
  return path.extname(file) === '.md';
}

function isAssetsFolder(folder) {
  return path.basename(folder).endsWith('.assets');
}

function findFilesNotInMarkdown(rootDir) {
  const directories = getFilesInDir(rootDir);

  directories.forEach(dir => {
    if (fs.statSync(dir).isDirectory()) {
      // 递归调用以遍历子目录
      findFilesNotInMarkdown(dir);

      if (isAssetsFolder(dir)) {
        // 查找.assets文件夹中的所有文件
        const filesInAssets = getFilesInDir(dir).filter(file => fs.statSync(file).isFile());
        const assetFileNames = filesInAssets.map(file => path.basename(file));

        // 寻找对应的.md 文件
        const parentDir = path.dirname(dir);
        const markdownFiles = getFilesInDir(parentDir).filter(isMarkdownFile);

        // 读取所有.md 文件内容
        const markdownContents = markdownFiles.map(mdFile => fs.readFileSync(mdFile, 'utf-8'));

        // 统计出现的文件名
        const foundFiles = new Set();
        markdownContents.forEach(content => {
          assetFileNames.forEach(fileName => {
            // URL 解码
            const encodedFileName = encodeURIComponent(fileName);
            if (content.includes(fileName) || content.includes(encodedFileName)) {
              foundFiles.add(fileName);
            }
          });
        });

        // 输出未出现的文件
        assetFileNames.forEach(fileName => {
          if (!foundFiles.has(fileName)) {
            console.log(`未出现在.md 文件中的文件: ${fileName} (所在目录: ${dir})`);
          }
        });
      }
    }
  });
}

// 获取命令行参数
const [rootDir] = process.argv.slice(2);

if (!rootDir) {
  console.error('请提供一个目录作为参数，例如：node search-unused-images2.js ./目标目录');
  process.exit(1);
}

// 开始查找文件
findFilesNotInMarkdown(rootDir);
