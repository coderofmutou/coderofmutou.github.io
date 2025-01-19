from compress_images import *
from search_unused_images import *
from convert_html_to_markdown import *

if __name__ == "__main__":
    # 示例文件路径（可以修改为你自己的文件路径）
    directory = r'\docs\01.Java基础\Java从入门到精通(JDK17版)\尚硅谷_第18章_JDK8-17新特性'
    input_markdown_file = os.path.join(directory, '尚硅谷_宋红康_第18章_JDK8-17新特性.md')   # 输入 Markdown 文件路径
    output_markdown_file = input_markdown_file.replace('.md', '_new.md')   # 输出的 Markdown 文件路径

    # 执行文件转换
    process_html_file(input_markdown_file, output_markdown_file)

    # 直接在脚本中定义目录路径和Markdown文件路径
    images_dir = os.path.join(directory, 'images')         # 图片文件夹路径

    # 执行图片压缩和Markdown文件更新
    try:
        compress_images(images_dir, output_markdown_file)
    except Exception as e:
        print("处理过程中发生错误:", e)

    # 直接在脚本中定义目录路径和Markdown文件路径
    markdown_file_path = output_markdown_file.replace('.md', '_new.md')  # Markdown文件路径

    # 执行搜索未使用图片的功能
    try:
        search_unused_images(images_dir, markdown_file_path)
    except Exception as e:
        print(f"处理过程中发生错误: {e}")
