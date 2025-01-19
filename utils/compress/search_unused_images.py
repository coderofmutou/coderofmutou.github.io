'''
功能概述：检索未在Markdown文件中使用的图片文件夹中的图片
'''
import os
import urllib.parse

def search_unused_images(directory, markdown_file_path):
    # 获取Markdown文件的原始内容
    try:
        with open(markdown_file_path, 'r', encoding='utf-8') as f:
            markdown_text = f.read()
    except Exception as e:
        print(f"读取Markdown文件时出错: {e}")
        return

    # 获取目录中的所有文件
    try:
        files = os.listdir(directory)
        # 使用列表推导式过滤掉backup文件
        files = [file for file in files if 'backup' not in file]
    except Exception as e:
        print(f"读取目录时出错: {e}")
        return

    # 检索图片是否在Markdown文件中引用
    for file in files:
        image_name = os.path.basename(file)
        encoded_file_name = urllib.parse.quote(image_name)

        # 如果图片文件未在Markdown中被引用，打印未使用的图片
        if image_name not in markdown_text and encoded_file_name not in markdown_text:
            print(f"图片: {file} 未被使用！！！")

    print(f"已搜索未使用的图片完成。")

if __name__ == "__main__":
    # 直接在脚本中定义目录路径和Markdown文件路径
    directory = r'\docs\01.Java基础\Java从入门到精通(JDK17版)\18.尚硅谷_第18章_JDK8-17新特性'
    images_dir = os.path.join(directory, 'images')         # 图片文件夹路径
    markdown_file_path = os.path.join(directory, '18.尚硅谷_宋红康_第18章_JDK8-17新特性.md')  # Markdown文件路径

    # 执行搜索未使用图片的功能
    try:
        search_unused_images(images_dir, markdown_file_path)
    except Exception as e:
        print(f"处理过程中发生错误: {e}")
