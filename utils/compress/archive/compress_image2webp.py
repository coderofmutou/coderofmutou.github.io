"""
接受一张图片的路径，并将其压缩为 WebP 格式，保存到原路径。
"""
from PIL import Image
import os

def compress_image_to_webp(image_path):
    # 检查文件是否存在
    if not os.path.exists(image_path):
        print(f"文件 {image_path} 不存在，请检查路径是否正确。")
        return

    # 获取图片文件扩展名
    extname = os.path.splitext(image_path)[1].lower()

    # 如果不是支持的格式，则返回
    if extname not in ['.jpg', '.jpeg', '.png', '.gif']:
        print(f"不支持的文件格式: {extname}. 只支持 JPG, PNG, GIF 格式。")
        return

    try:
        # 打开图片
        with Image.open(image_path) as img:
            # 构建输出的文件路径，将原扩展名替换为 .webp
            output_path = os.path.splitext(image_path)[0] + '.webp'

            # 保存为 WebP 格式，设置压缩质量为 75（你可以根据需要调整质量）
            img.save(output_path, format='WEBP', quality=75)
            print(f"图片已成功压缩并保存为: {output_path}")

    except Exception as e:
        print(f"处理图片时出错: {e}")

if __name__ == "__main__":
    # 输入图片路径
    image_path = r'image.png'  # 替换为你自己的图片路径

    # 调用压缩函数
    compress_image_to_webp(image_path)
