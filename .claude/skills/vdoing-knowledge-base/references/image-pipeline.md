# 图片处理决策树与工具命令

知识库图片资产治理：外链本地化、转 webp、查未使用、修路径。所有命令见 [工具命令速查表](./scripts-cheatsheet.md)，本文件聚焦**决策与流程**。

---

## 一、处理流程总览

```
扫描现状（kb:scan）
   ↓
有外链图？ ──是──→ kb:download 本地化
   ↓ 否
有 <img> 标签？ ──是──→ kb:convert 转 Markdown 语法
   ↓ 否
有非 webp 图？ ──是──→ kb:compress 转 webp
   ↓ 否
kb:scan 复查未使用图片 + 绝对路径告警
   ↓
人工确认后删除未引用图片（脚本永不自动删）
```

**单篇一键流水线**：`kb:all <md>` 自动串行 download → convert → compress → scan --local，任一步失败不中断，最终产 `*_new.md`。

---

## 二、分场景决策

### 场景 1：整合他人笔记，含外链图片

```bash
cd utils/compress
npm run kb:all -- docs/02.微服务核心/50.持久层框架/10.MyBatis.md
```

- 外链图下载到同级 `<篇名>.assets/`，md 引用替换为相对路径
- 自动转 webp，原图进 `backup/`
- 最后给本篇未引用图片报告

### 场景 2：只清理全仓库未使用图片

```bash
cd utils/compress
npm run kb:scan -- docs
```

输出三段报告：
- **全仓库未引用（可考虑删除）**：建反向索引后确认无任何 md 引用，可删
- **仅 1 篇引用**：列出引用者，保留
- **多篇引用**：列出所有引用者，保留

> ⚠️ **单篇模式 `kb:scan --local=<md>` 的扫描范围**：会递归扫描 md 所在目录下的所有 asset 目录（含同目录其他文档的 `<篇名>.assets/`），因此"本篇未引用"清单可能列出**同目录其他文档的图片**——需人工剔除。单篇模式只报告、不附删除建议；要可靠删图，用全仓库模式 `kb:scan <docs根>` 建反向索引确认。

### 场景 3：路径修复（404 / 中文路径 / 绝对路径）

`kb:scan` 会顺带报告 md 中的**绝对路径图片引用**（`/img/x.png`、`C:\...`），这是从他人笔记迁移的高频问题。修复方式见 [常见问题排查](./troubleshooting.md)。

### 场景 4：HTML `<img>` 转 Markdown

从语雀/Notion 导出的笔记常有 `<img src="...">`，`kb:convert` 转为 `![]()` 语法。仅转相对路径、非代码块内的 `<img>`；绝对路径/外链/代码块内跳过。

---

## 三、图目录命名约定

工具自动探测两种命名：

| 命名 | 用途 |
|------|------|
| `<篇名>.assets/` | **新约定**，单篇专属图目录（如 `10.基础.assets/`） |
| `images/` | **旧约定**，同级共享图目录 |

省略 `[assets目录]` 参数时，按 `<篇名>.assets` → `images` → 新建 `<篇名>.assets` 顺序探测。

---

## 四、本地化与路径修复示例

### 外链改本地

```markdown
# before
![流程图](https://example.com/a/b/c.png)

# after（kb:download 自动完成）
![流程图](./MyBatis.assets/c.png)
# 再经 kb:compress
![流程图](./MyBatis.assets/c.webp)
```

### 绝对路径改相对路径

```markdown
# before（kb:scan 会告警）
![结果图](/docs/03.微服务生态/10.安全框架/SpringSecurity.assets/result.png)
![结果图](C:\notes\SpringSecurity.assets\result.png)

# after（手动改）
![结果图](./SpringSecurity.assets/result.webp)
```

### 中文路径风险

图片路径含中文时，部署环境可能出现编码差异导致不显示。优先把图片文件名改为英文或拼音，统一相对路径引用。或启用 `markdown-it-disable-url-encode` 插件兜底。

---

## 五、完成标准（Quality Gate）

- [ ] 目标范围内外链图片已本地化（如要求）
- [ ] 新图片路径均为相对路径且可访问
- [ ] webp 转换后关键图可读性达标
- [ ] `kb:scan` 无绝对路径图片告警
- [ ] 未使用图片清单已产出并人工确认（脚本未自动删）
- [ ] 修复后页面无明显图片加载失败

---

## 六、决策分支

| 情况 | 处理 |
|------|------|
| 清晰度明显下降 | 保留原图，仅替换通过质检的 webp |
| 同名文件冲突 | 工具按文档名/序号重命名，避免覆盖 |
| 历史文章 permalink 已发布 | 不改 permalink，仅修图与引用 |
| 删除风险高 | 先 `kb:scan` 出报告，人工确认后再删 |

> 旧 `.py` 脚本（`download_external_images.py` / `compress_images.py` 等）已归档到 `utils/compress/archive/`，统一用上面的 `kb:*` 命令。
