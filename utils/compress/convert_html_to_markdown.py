'''
    使用正则表达式匹配 HTML 中的 <img> 标签。
    提取 src 和 alt 属性，并将其转换为 Markdown 格式 ![]()。
'''
import re
import os

def convert_html_to_markdown(html_text):
    # 改进的正则表达式匹配 <img> 标签，提取 src 和 alt 属性
    img_tag_pattern = r'<img\s+src="([^"]+)"\s+alt="([^"]*)"[^>]*>'

    # 使用正则表达式将 HTML <img> 标签转换为 Markdown 格式
    markdown_text = re.sub(img_tag_pattern, r'![\2](\1)', html_text)

    return markdown_text

def process_html_file(input_file, output_file):
    # 读取 HTML 文件内容
    with open(input_file, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # 转换 HTML 内容为 Markdown
    markdown_content = convert_html_to_markdown(html_content)

    # 写入转换后的 Markdown 内容
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(markdown_content)

    print(f"已将 HTML 格式转换为 Markdown 格式，输出到 {output_file}")

if __name__ == "__main__":
    # 示例文件路径（可以修改为你自己的文件路径）
    directory = r'\docs\01.Java基础\Java从入门到精通(JDK17版)\尚硅谷_第02章_变量与运算符'
    input_markdown_file = os.path.join(directory, '尚硅谷_宋红康_第02章_变量与运算符.md')   # 输入 Markdown 文件路径
    output_markdown_file = input_markdown_file.replace('.md', '_new.md')   # 输出的 Markdown 文件路径

    # 执行文件转换
    process_html_file(input_markdown_file, output_markdown_file)
