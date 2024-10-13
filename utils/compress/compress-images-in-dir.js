const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function compressImagesInDir(directory) {
  // 获取Markdown文件名和路径
  // 获取目录中的所有图片文件
  const files = fs.readdirSync(directory);

  const imageFiles = files.filter(file => ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file).toLowerCase()));

  // 如果没有图片，直接退出
  if (imageFiles.length === 0) {
    console.log(`图片文件夹 ${directory} 中没有发现可压缩的图片。`);
    return;
  }

  // 创建 backup 文件夹
  const backupFolderPath = path.join(directory, 'backup');
  if (!fs.existsSync(backupFolderPath)) {
    fs.mkdirSync(backupFolderPath);
  }

  // 压缩图片
  for (const file of imageFiles) {
    const inputFilePath = path.join(directory, file);
    const outputFilePath = path.join(directory, `${path.basename(file, path.extname(file))}.webp`);

    try {
      // 压缩为WebP格式
      await sharp(inputFilePath).webp({quality: 75}).toFile(outputFilePath);

      const originalFileName = path.basename(file);
      // 移动原始图片到 backup 文件夹
      const backupFilePath = path.join(backupFolderPath, file);
      fs.renameSync(inputFilePath, backupFilePath);
      console.log(`压缩完成并移动了图片: ${originalFileName} 到 backup 文件夹`);
    } catch (err) {
      console.error(`压缩图片 ${file} 时出错: `, err);
    }
  }
}

// 获取命令行参数
const [directory] = process.argv.slice(2);

if (!directory) {
  console.error('请提供图片文件路径作为参数，例如：npm run compress-images docs/.vuepress/public/img');
  process.exit(1);
}

// 执行图片压缩和Markdown文件更新
compressImagesInDir(directory)
  .catch(err => {
    console.error('处理过程中发生错误:', err);
  });
