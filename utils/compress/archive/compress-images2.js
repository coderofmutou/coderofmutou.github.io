/*
功能概述：将图片文件夹中的图片压缩为.webp，并替换markdown文件中的引用路径。
        原图片移动到backup文件夹中，生成的新Markdown文件以_new.md结尾
    npm run compress-images ./example.md
    需要图片文件夹名 = markdown文件名 + .assets，且在markdown文件同层目录
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function compressImagesAndUpdateMarkdown(markdownFilePath) {
  // 获取Markdown文件名和路径
  const markdownDir = path.dirname(markdownFilePath);
  const markdownFileName = path.basename(markdownFilePath, '.md');

  // 提取出图片文件夹名：移除开头的数字和"."，并加上 ".assets"
  const imageFolderName = markdownFileName.replace(/^\d+\./, '') + '.assets';
  const imageFolderPath = path.join(markdownDir, imageFolderName);

  // 检查图片文件夹是否存在
  if (!fs.existsSync(imageFolderPath)) {
    console.error(`图片文件夹 ${imageFolderName} 不存在。`);
    process.exit(1);
  }

  // 获取Markdown文件的内容
  let markdownText = fs.readFileSync(markdownFilePath, 'utf-8');

  // 获取目录中的所有图片文件
  const files = fs.readdirSync(imageFolderPath);
  const imageFiles = files.filter(file => ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file).toLowerCase()));

  // 如果没有图片，直接退出
  if (imageFiles.length === 0) {
    console.log(`图片文件夹 ${imageFolderName} 中没有发现可压缩的图片。`);
    return;
  }

  // 创建 backup 文件夹
  const backupFolderPath = path.join(imageFolderPath, 'backup');
  if (!fs.existsSync(backupFolderPath)) {
    fs.mkdirSync(backupFolderPath);
  }

  // 压缩图片
  for (const file of imageFiles) {
    const inputFilePath = path.join(imageFolderPath, file);
    const outputFilePath = path.join(imageFolderPath, `${path.basename(file, path.extname(file))}.webp`);

    try {
      // 压缩为WebP格式
      await sharp(inputFilePath).webp({quality: 75}).toFile(outputFilePath);

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

  // 更新Markdown文件
  const newMarkdownFilePath = markdownFilePath.replace(/\.md$/, '_new.md');
  fs.writeFileSync(newMarkdownFilePath, markdownText, 'utf-8');
  console.log(`已保存更新后的Markdown文件: ${newMarkdownFilePath}`);
}

// 获取命令行参数
const [markdownFilePath] = process.argv.slice(2);

if (!markdownFilePath) {
  console.error('请提供Markdown文件路径作为参数，例如：npm run compress-images ./example.md');
  process.exit(1);
}

// 执行图片压缩和Markdown文件更新
compressImagesAndUpdateMarkdown(markdownFilePath)
  .catch(err => {
    console.error('处理过程中发生错误:', err);
  });
