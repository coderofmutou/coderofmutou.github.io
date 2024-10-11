// file: search-unused-images.js
const fs = require('fs');
const path = require('path');

async function searchUnusedImages(directory, markdownFilePath) {
  // 获取Markdown文件的原始内容
  let markdownText = fs.readFileSync(markdownFilePath, 'utf-8');
  // 获取目录中的所有文件
  const files = fs.readdirSync(directory);

  // 压缩图片
  for (const file of files) {
    const imageName = path.basename(file)
    const encodedFileName = encodeURIComponent(imageName);
    if (!markdownText.includes(imageName) && !markdownText.includes(encodedFileName)) {
      console.log(`图片: ${file} 未被使用！！！`);
    }
  }
}

// 获取命令行参数
const [directory, markdownFilePath] = process.argv.slice(2);

if (!directory || !markdownFilePath) {
  console.error('请提供目录路径和Markdown文件路径作为参数，例如：npm run search-unused-images ./images ./example.md');
  process.exit(1);
}

// 执行图片压缩和Markdown文件更新
searchUnusedImages(directory, markdownFilePath)
  .catch(err => {
    console.error('处理过程中发生错误:', err);
  });
