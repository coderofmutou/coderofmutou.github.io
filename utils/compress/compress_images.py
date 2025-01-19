"""
功能概述：将图片文件夹中的图片压缩为.webp，并替换markdown文件中的引用路径。
        原图片移动到backup文件夹中，生成的新Markdown文件以_new.md结尾
    npm run compress-images ./images ./example.md
    参数1：图片文件路径，参数2：md文件路径
"""
import os
import shutil
from PIL import Image
import urllib.parse
import re

def compress_images(directory, markdown_file_path):
    # 获取Markdown文件的原始内容
    with open(markdown_file_path, 'r', encoding='utf-8') as f:
        markdown_text = f.read()

    # 获取目录中的所有文件
    files = os.listdir(directory)

    # 过滤出图片文件（jpg, jpeg, png, gif）
    image_files = [file for file in files if os.path.splitext(file)[1].lower() in ['.jpg', '.jpeg', '.png', '.gif']]

    # 如果没有图片文件，直接退出，不做任何操作
    if not image_files:
        print("没有需要压缩的图片，跳过处理。")
        return

    # 创建 backup 文件夹
    backup_folder_path = os.path.join(directory, 'backup')
    if not os.path.exists(backup_folder_path):
        os.makedirs(backup_folder_path)

    # 压缩图片
    for file in image_files :
        extname = os.path.splitext(file)[1].lower()
        if extname in ['.jpg', '.jpeg', '.png', '.gif']:
            input_file_path = os.path.join(directory, file)
            output_file_path = os.path.join(directory, f"{os.path.splitext(file)[0]}.webp")

            try:
                # 压缩为WebP格式
                with Image.open(input_file_path) as img:
                    img.save(output_file_path, format='WEBP', quality=75)

                # 更新Markdown中的图片引用
                original_file_name = os.path.basename(file)
                new_file_name = os.path.basename(output_file_path)

                # 将原文件名和URL编码后的文件名都进行替换
                encoded_file_name = urllib.parse.quote(original_file_name)  # 对原文件名进行URL编码
                encoded_new_file_name = urllib.parse.quote(new_file_name)  # 对新文件名进行URL编码

                markdown_text = re.sub(re.escape(original_file_name), new_file_name, markdown_text)
                markdown_text = re.sub(re.escape(encoded_file_name), encoded_new_file_name, markdown_text)

                # 移动原始图片到 backup 文件夹
                backup_file_path = os.path.join(backup_folder_path, file)
                shutil.move(input_file_path, backup_file_path)
                print(f"压缩完成并移动了图片: {original_file_name} 到 backup 文件夹")
            except Exception as err:
                print(f"压缩图片 {file} 时出错: {err}")

    # 生成新的Markdown文件
    new_markdown_file_path = markdown_file_path.replace('.md', '_new.md')
    with open(new_markdown_file_path, 'w', encoding='utf-8') as f:
        f.write(markdown_text)
    print(f"已保存更新后的Markdown文件: {new_markdown_file_path}")

if __name__ == "__main__":
#     import sys
#     # 获取命令行参数
#     if len(sys.argv) < 3:
#         print("请提供目录路径和Markdown文件路径作为参数，例如：python script.py ./images ./example.md")
#         sys.exit(1)
#
#     directory = sys.argv[1]
#     markdown_file_path = sys.argv[2]

    # 直接在脚本中定义目录路径和Markdown文件路径
    directory = r'\docs\01.Java基础\Java从入门到精通(JDK17版)\尚硅谷_第02章_变量与运算符'
    images_dir = os.path.join(directory, 'images')         # 图片文件夹路径
    markdown_file_path = os.path.join(directory, '尚硅谷_宋红康_第02章_变量与运算符.md')  # Markdown文件路径


    # 执行图片压缩和Markdown文件更新
    try:
        compress_images(images_dir, markdown_file_path)
    except Exception as e:
        print("处理过程中发生错误:", e)
