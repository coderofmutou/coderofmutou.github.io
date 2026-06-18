"""
功能：扫描 Markdown 文件中的外部图片链接（http/https），
     批量下载到指定的本地 assets 文件夹，并将 md 中的 URL 替换为相对路径。

使用方式：
    python download_external_images.py <md文件路径> [assets文件夹路径]

示例：
    python download_external_images.py ../../docs/02.微服务核心/50.持久层框架/10.MyBatis.md
    python download_external_images.py ../../docs/.../10.MyBatis.md ../../docs/.../MyBatis.assets

说明：
    - 如不指定 assets 文件夹，默认在 md 文件同级目录创建 {md文件名}.assets/ 文件夹
    - 已是本地相对路径的图片引用不受影响
    - 下载失败的链接会打印警告，原链接保留不替换
    - 生成新文件 {原文件名}_new.md，需手动重命名替换原文件
"""

import re
import os
import sys
import urllib.request
import urllib.parse
from pathlib import Path


# 匹配 Markdown 图片语法中的外部 URL：![alt](http://... 或 https://...)
IMAGE_PATTERN = re.compile(r'!\[([^\]]*)\]\((https?://[^\s)]+)\)')


def download_image(url: str, save_path: str) -> bool:
    """下载单张图片到指定路径，返回是否成功。"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as response:
            with open(save_path, 'wb') as f:
                f.write(response.read())
        return True
    except Exception as e:
        print(f"  ⚠️  下载失败: {url}\n     原因: {e}")
        return False


def get_filename_from_url(url: str, index: int) -> str:
    """从 URL 中提取文件名，若无法提取则生成序号文件名。"""
    parsed = urllib.parse.urlparse(url)
    path = urllib.parse.unquote(parsed.path)
    filename = os.path.basename(path)

    # 过滤掉无效的文件名（无扩展名或名称过长）
    if filename and '.' in filename and len(filename) <= 100:
        # 去除文件名中的非法字符
        filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
        return filename

    # 根据 URL 中的扩展名猜测
    for ext in ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']:
        if ext in url.lower():
            return f'image_{index:03d}{ext}'

    return f'image_{index:03d}.png'


def download_external_images(md_file_path: str, assets_dir: str = None):
    md_path = Path(md_file_path).resolve()
    if not md_path.exists():
        print(f"错误：文件不存在 - {md_file_path}")
        sys.exit(1)

    # 确定 assets 文件夹路径
    if assets_dir:
        assets_path = Path(assets_dir).resolve()
    else:
        assets_path = md_path.parent / f"{md_path.stem}.assets"

    assets_path.mkdir(parents=True, exist_ok=True)
    print(f"图片将保存到: {assets_path}")

    # 读取 md 文件
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    matches = IMAGE_PATTERN.findall(content)
    if not matches:
        print("未发现外部图片链接，无需处理。")
        return

    print(f"发现 {len(matches)} 个外部图片链接，开始下载...\n")

    new_content = content
    success_count = 0

    for index, (alt_text, url) in enumerate(matches, start=1):
        filename = get_filename_from_url(url, index)
        # 若文件已存在（可能同名冲突），加序号区分
        save_path = assets_path / filename
        if save_path.exists():
            stem, suffix = os.path.splitext(filename)
            filename = f"{stem}_{index:03d}{suffix}"
            save_path = assets_path / filename

        print(f"[{index}/{len(matches)}] {filename}")
        print(f"  URL: {url}")

        if download_image(url, str(save_path)):
            # 计算相对路径（相对于 md 文件所在目录）
            rel_path = os.path.relpath(save_path, md_path.parent).replace('\\', '/')
            # 替换 md 中的 URL 为本地相对路径（只替换第一次出现，避免误替换）
            old_ref = f'![{alt_text}]({url})'
            new_ref = f'![{alt_text}]({rel_path})'
            new_content = new_content.replace(old_ref, new_ref, 1)
            print(f"  ✅ 已保存，路径替换为: {rel_path}")
            success_count += 1
        print()

    # 写入新文件
    if success_count > 0:
        new_md_path = md_path.parent / f"{md_path.stem}_new.md"
        with open(new_md_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"完成！成功下载 {success_count}/{len(matches)} 张图片。")
        print(f"新文件已生成: {new_md_path}")
        print(f"请确认无误后手动将其重命名替换原文件。")
    else:
        print("所有图片下载均失败，未生成新文件。")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python download_external_images.py <md文件路径> [assets文件夹路径]")
        sys.exit(1)

    md_file = sys.argv[1]
    assets_folder = sys.argv[2] if len(sys.argv) >= 3 else None
    download_external_images(md_file, assets_folder)
