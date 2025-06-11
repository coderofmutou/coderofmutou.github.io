'''
    使用正则表达式匹配 HTML 中的 <img> 标签。
    提取 src 和 alt 属性，并将其转换为 Markdown 格式 ![]()。
    如果 alt 为空，提取文件名作为 alt 值
    如果没有需要转换的图片标签，则不生成新文件。

    返回最终的output_file
'''
import re
import os

def convert_html_to_markdown(html_text):
    # 改进的正则表达式匹配 <img> 标签，提取 src 和 alt 属性
    # alt 属性是可选的，如果没有 alt，则默认使用文件名
    img_tag_pattern = re.compile(r'<img\s+[^>]*?src=["\']([^"\']+)["\'][^>]*(?:\s+alt=["\']([^"\']*)["\'])?[^>]*>', re.IGNORECASE)

    def process_match(match):
        src = match.group(1)
        alt = match.group(2) if match.group(2) else os.path.basename(src)
        # 统一路径分隔符为/
        normalized_src = src.replace('\\', '/')
        return f'![{alt}]({normalized_src})'

    # 检查是否有 <img> 标签需要转换
    if re.search(img_tag_pattern, html_text):
        # 使用正则表达式将 HTML <img> 标签转换为 Markdown 格式
        # 如果 alt 为空，提取文件名作为 alt 值
        html_text = re.sub(img_tag_pattern, process_match, html_text)
        return html_text, True  # 返回转换后的文本和是否有替换
    else:
        return html_text, False  # 如果没有替换，直接返回原文本

def process_html_file(input_file, output_file):
    # 读取 HTML 文件内容
    with open(input_file, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # 转换 HTML 内容为 Markdown，获取是否有替换
    markdown_content, has_changes = convert_html_to_markdown(html_content)

    if has_changes:
        # 如果有替换，才写入转换后的 Markdown 内容
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(markdown_content)
        print(f"已将 HTML 格式转换为 Markdown 格式，输出到 {output_file}")
        return output_file
    else:
        print("没有需要转换的图片标签，未进行文件生成。")
        return input_file

    return output_file  # 返回最终的 output_file（可以传递到后续方法）

if __name__ == "__main__":
    # 示例文件路径（可以修改为你自己的文件路径）
    directory = r'docs\01.Java基础\20.核心\21.MySQL从入门到高级-高级篇'
    input_markdown_file = os.path.join(directory, '第19章_数据库备份与恢复.md')   # 输入 Markdown 文件路径)
    output_markdown_file = input_markdown_file.replace('.md', '_new.md')   # 输出的 Markdown 文件路径

    # 执行文件转换，并获取最终的 output_markdown_file
    output_markdown_file = process_html_file(input_markdown_file, output_markdown_file)

    # 后续处理时，output_markdown_file 会作为参数传入
    print(f"最终的输出文件是: {output_markdown_file}")
