"""
功能概述：如果markdown文件中引用了图片文件夹中的图片，
        则将对应图片压缩为.webp，并替换markdown文件中的引用路径。
        原图片移动到backup文件夹中，生成的新Markdown文件以_new.md结尾
    npm run compress-images ./images ./example.md
    参数1：图片文件路径，参数2：md文件路径

    如果没有图片被处理或修改，则不生成新的Markdown文件
    注：最终图片文件夹中没有放入backup文件夹中的非webp格式图片大概率就是未被引用过的图片或有问题的
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

    # 只在图片被引用时执行压缩和替换
    changes_made = False  # 用于标记是否有图片被修改或压缩
    for file in files:
        extname = os.path.splitext(file)[1].lower()
        if extname in ['.jpg', '.jpeg', '.png', '.gif', '.bmp']:
            image_name = os.path.basename(file)
            encoded_image_name = urllib.parse.quote(image_name)  # URL 编码后的文件名

            # 如果图片没有在Markdown文件中引用，跳过
            if image_name not in markdown_text and encoded_image_name not in markdown_text:
#                 print(f"图片: {image_name} 未被引用，跳过处理")
                continue

            # 如果图片在Markdown文件中引用，则执行压缩和替换
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

                # 替换Markdown中的未编码和已编码的文件名
                markdown_text = re.sub(re.escape(original_file_name), new_file_name, markdown_text)
                markdown_text = re.sub(re.escape(encoded_file_name), encoded_new_file_name, markdown_text)

                # 移动原始图片到 backup 文件夹
                backup_folder_path = os.path.join(directory, 'backup')
                if not os.path.exists(backup_folder_path):
                    os.makedirs(backup_folder_path)

                backup_file_path = os.path.join(backup_folder_path, file)
                shutil.move(input_file_path, backup_file_path)
                print(f"压缩完成并移动了图片: {original_file_name} 到 backup 文件夹")

                changes_made = True  # 标记为已修改
            except Exception as err:
                print(f"压缩图片 {file} 时出错: {err}")

    # 如果有图片修改或压缩，才生成新的Markdown文件
    if changes_made:
        new_markdown_file_path = markdown_file_path.replace('.md', '_new.md')
        with open(new_markdown_file_path, 'w', encoding='utf-8') as f:
            f.write(markdown_text)
        print(f"已保存更新后的Markdown文件: {new_markdown_file_path}")
        return new_markdown_file_path
    else:
        print("没有进行图片压缩或路径替换，未生成新的Markdown文件。")
        return markdown_file_path

    # 检查Markdown文件中是否还有未替换为webp格式的图片
    check_for_unreplaced_images(markdown_text)

def check_for_unreplaced_images(markdown_text):
    # 使用正则表达式匹配所有的图片引用
    img_pattern = r'!\[.*?\]\((.*?)\)'

    # 查找所有图片的路径
    image_paths = re.findall(img_pattern, markdown_text)

    # 查找未替换为webp的图片路径
    unreplaced_images = [img for img in image_paths if not img.lower().endswith('.webp')]

    if unreplaced_images:
        print("\n以下图片路径未替换为WebP格式：")
        for img in unreplaced_images:
            print(f"未替换的图片: {img}")
    else:
        print("\n所有图片已成功替换为WebP格式。")

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
