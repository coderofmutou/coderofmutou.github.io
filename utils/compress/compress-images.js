/*
功能概述：将图片文件夹中的图片压缩为.webp，并替换markdown文件中的引用路径。
        原图片移动到backup文件夹中，生成的新Markdown文件以_new.md结尾
    npm run compress-images ./images ./example.md
    参数1：图片文件路径，参数2：md文件路径
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function compressImages(directory, markdownFilePath) {
  // 获取Markdown文件的原始内容
  let markdownText = fs.readFileSync(markdownFilePath, 'utf-8');
  // 获取目录中的所有文件
  const files = fs.readdirSync(directory);

  // 创建 backup 文件夹
  const backupFolderPath = path.join(directory, 'backup');
  if (!fs.existsSync(backupFolderPath)) {
    fs.mkdirSync(backupFolderPath);
  }

  // 压缩图片
  for (const file of files) {
    const extname = path.extname(file).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.gif'].includes(extname)) {
      const inputFilePath = path.join(directory, file);
      const outputFilePath = path.join(directory, `${path.basename(file, extname)}.webp`);

      try {
        // 压缩为WebP格式
        await sharp(inputFilePath).webp({ quality: 75 }).toFile(outputFilePath);

        // 更新Markdown中的图片引用
        const originalFileName = path.basename(file);
        const newFileName = path.basename(outputFilePath);

        // 将原文件名和URL编码后的文件名都进行替换
        const encodedFileName = encodeURIComponent(originalFileName); // 对原文件名进行URL编码
        const encodedNewFileName = encodeURIComponent(newFileName);   // 对新文件名进行URL编码

        markdownText = markdownText
          .replace(new RegExp(originalFileName, 'g'), newFileName)      // 替换未编码的链接
          .replace(new RegExp(encodedFileName, 'g'), encodedNewFileName);  // 替换已编码的链接

        // 移动原始图片到 backup 文件夹
        const backupFilePath = path.join(backupFolderPath, file);
        fs.renameSync(inputFilePath, backupFilePath);
        console.log(`压缩完成并移动了图片: ${originalFileName} 到 backup 文件夹`);
      } catch (err) {
        console.error(`压缩图片 ${file} 时出错: `, err);
      }
    }
  }

  // 生成新的Markdown文件
  const newMarkdownFilePath = markdownFilePath.replace(/\.md$/, '_new.md');
  fs.writeFileSync(newMarkdownFilePath, markdownText, 'utf-8');
  console.log(`已保存更新后的Markdown文件: ${newMarkdownFilePath}`);
}

// 获取命令行参数
const [directory, markdownFilePath] = process.argv.slice(2);

if (!directory || !markdownFilePath) {
  console.error('请提供目录路径和Markdown文件路径作为参数，例如：npm run compress-images ./images ./example.md');
  process.exit(1);
}

// 执行图片压缩和Markdown文件更新
compressImages(directory, markdownFilePath)
  .catch(err => {
    console.error('处理过程中发生错误:', err);
  });
