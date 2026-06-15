# 笔记整合工作流

将一份或多份他人的原始笔记，提炼整合为个人风格的知识库文档。

---

## 整体流程

```
第一步：分析原始资料
     ↓
第二步：处理外部图片资源（下载 + 本地化）
     ↓
第三步：构建知识骨架（大纲）
     ↓
第四步：逐节精简整合（去噪 + 取精华）
     ↓
第五步：补充个人理解与实践经验
     ↓
第六步：规范化输出（frontmatter + 图片处理工具链）
```

---

## 第一步：分析原始资料

拿到原始笔记后，先通读一遍，回答以下问题：

- **核心主题是什么？** 用一句话概括
- **受众前置知识？** 判断是入门 / 进阶 / 高级
- **知识点列表**：列出所有小节标题，感受覆盖范围
- **质量评估**：
  - 哪些部分有高质量的代码示例或图表？（保留）
  - 哪些部分是重复的概念介绍？（去重）
  - 哪些部分与主题无关（讲师介绍、报名广告、版权声明）？（删除）
  - 哪些图片是流程/步骤说明截图，可以用文字代替？（标记，第四步处理）

---

## 第二步：处理外部图片资源

他人笔记中的图片通常以以下几种形式存在：

### 情况一：外部 URL（他人知识库/图床链接）

```
![描述](https://xxx.github.io/notes/images/xxx.png)
![描述](https://cdn.nlark.com/yuque/xxx.png)
```

**必须下载本地化**，否则对方删除后图片失效。操作步骤：

1. 在文档同级目录创建 `{文档名}.assets/` 文件夹（如 `MyBatis.assets/`）
2. 下载图片，保存时保留原始文件名（后续工具会批量转 webp）
3. 将 md 中的 URL 引用替换为相对路径：
   ```
   ![描述](./MyBatis.assets/xxx.png)
   ```
4. 若外部图片较多，使用项目内置脚本批量下载：
   ```bash
   # 脚本：utils/compress/download_external_images.py
   # 功能：扫描 md 文件中所有 http/https 图片链接，批量下载到本地 assets 文件夹，
   #       并将 md 中的 URL 替换为相对路径，生成 {原文件名}_new.md
   python utils/compress/download_external_images.py <md文件路径>
   # 示例：
   python utils/compress/download_external_images.py docs/02.微服务核心/50.持久层框架/10.MyBatis.md
   ```
   > 下载完成后再运行 `compress_images.py` 将图片统一转为 webp。

### 情况二：本地相对路径（images/ 文件夹）

原笔记中已是本地引用，直接将对应的图片文件夹一起复制过来，后续用工具批量转 webp。

### 情况三：Base64 内嵌图片

若图片以 `![](data:image/png;base64,...)` 的形式内嵌，且内容有保留价值，先用浏览器或工具导出为图片文件再引用；无保留价值的直接删除。

---

## 第三步：构建知识骨架（大纲）

按照以下通用框架组织大纲，根据主题灵活调整：

```markdown
# {技术名称}

## 1. 概述
### 1.1 是什么（What）
### 1.2 为什么用（Why）
### 1.3 与同类对比（VS）

## 2. 快速开始
### 2.1 环境准备 / 依赖引入
### 2.2 Hello World 示例

## 3. 核心概念
### 3.1 {概念1}
### 3.2 {概念2}
...

## 4. 常用功能 / API

## 5. 高级特性 / 原理（可选）

## 6. 最佳实践 / 注意事项

## 7. 常见问题（FAQ）
```

> 对于系列课程（多章节），每章对应一个独立 `.md` 文件，编号与原课程章节保持一致，不要合并到单文件。

---

## 第四步：逐节精简整合

### 去重原则

- 多份资料同一概念，选最清晰的一份为主，其余丢弃
- 判断标准：代码示例 > 类比解释 > 纯文字描述

### 去噪原则（必须删除）

- 讲师/机构介绍段落、报名广告、社群引导（加QQ群等）
- 仅重复前文标题的空洞「本章小结」
- 无信息量的课程目录/学习路线图截图

### 图片取舍判断标准

| 图片类型 | 处理方式 |
|----------|----------|
| 架构图、流程图、UML 图 | ✅ 保留并本地化 |
| 技术对比表格截图 | 优先改写为 Markdown 表格；截图模糊时保留 |
| 操作步骤截图（next/next/finish 式） | ❌ 替换为有序文字步骤，删除截图 |
| 控制台输出截图 | 能用代码块表达的用代码块，否则保留 |
| 纯 PPT 标题 / 封面 / 装饰图 | ❌ 直接删除 |
| 报错界面截图 | 核心错误信息用代码块，复杂界面截图可保留 |

**核心原则：图片只有在"文字无法准确表达"时才有必要存在。**

### 精简原则

- 一个代码示例能说明问题，不放多个
- 文字描述与代码示例二选一，优先代码
- 配置类内容用带注释的代码块，而非文字逐项解释

---

## 第五步：补充个人理解

在整合后，对以下类型的内容进行个人标注：

```markdown
> 💡 **个人注**：这里要注意 XXX，实际项目中建议 YYY。

> ⚠️ **踩坑记录**：升级到 X.X 版本后，此处行为变更为 ZZZ。

> 🔗 **扩展阅读**：[官方文档链接](https://...)
```

---

## 第六步：规范化输出与图片工具链

### 文件与格式

1. **文件命名**：`{两位数序号}.{标题}.md`，标题与 frontmatter `title` 一致
2. **frontmatter**：参照 [frontmatter 模板](./frontmatter-template.md) 填写
3. **代码块**：所有代码块必须标注语言（\```java, \```xml, \```yaml 等）
4. **标题层级**：H1 只用于文档标题，正文从 H2 开始

### 图片工具链（`utils/compress/`）

完成内容整合后，按以下顺序使用工具处理图片：

**Step 0（如有外部图片）：批量下载外部 URL 图片**

```bash
# 脚本：utils/compress/download_external_images.py
python utils/compress/download_external_images.py <md文件路径>
```

**Step 1：批量压缩为 webp 并更新 md 引用路径**

```bash
# 脚本：utils/compress/compress_images.py
# 功能：扫描 images/ 文件夹，将被 md 引用的图片压缩为 .webp，
#       更新 md 中的引用路径，原图移入 images/backup/ 文件夹
# 结果：生成 {文档名}_new.md，需手动重命名
python utils/compress/compress_images.py
```

> 压缩质量默认为 75，可在脚本中调整 `quality` 参数。

**Step 2：查找未使用的图片**

```bash
# 脚本：utils/compress/search_unused_images.py
# 功能：扫描 images/ 文件夹，输出未被 md 文件引用的图片列表
# 结果：确认后手动删除，或配合 backup 文件夹一起清理
python utils/compress/search_unused_images.py
```

> `compress_images.py` 运行后，留在 `images/` 中未进入 `backup/` 的非 webp 文件大概率就是未被引用的图片。

**Step 3（可选）：一键集成处理**

```bash
# 脚本：utils/compress/integrated_process.py
# 功能：顺序执行 HTML→Markdown 转换 → 图片压缩 → 未使用图片检索
# 适用：整理从语雀/Notion 等导出的 HTML 格式原始笔记
python utils/compress/integrated_process.py
```

### 图片存放规范

- 图片统一放入同级的 `{文档名}.assets/` 文件夹（如 `MyBatis.assets/`）
- 引用路径使用相对路径：`![描述](./MyBatis.assets/xxx.webp)`
- 最终图片必须为 `.webp` 格式

---

## 多文件系列笔记组织方式

当一个主题需要多个文件时（如课程系列），按以下方式组织：

```
docs/
  01.Java基础/
    20.核心/
      10.Java从入门到精通(JDK17版)/     ← 系列文件夹（带数字前缀）
        01.第01章_Java语言概述.md
        02.第02章_变量与运算符.md
        ...
```

- 系列文件夹内的文件按章节编号排列
- `permalink` 末尾加章节路径：`/java-basic/java-from-entry-to-proficiency/chapter-1/`
- `categories` 第二级填写系列名称：`Java从入门到精通(JDK17版)`

---

## 质量自检清单

整合完成后，逐项确认：

**内容质量：**
- [ ] 已删除无关噪声（讲师介绍、广告、社群引导文字）
- [ ] 操作步骤截图已替换为文字描述；纯装饰图已删除
- [ ] 重复的概念只保留一份最清晰的表述
- [ ] 所有代码块已标注语言
- [ ] 个人补充内容使用 `> 💡 个人注：` 格式标注

**格式规范：**
- [ ] frontmatter 字段完整（title / date / permalink / categories / author）
- [ ] permalink 在全项目中唯一
- [ ] H1 标题与 frontmatter `title` 一致

**图片处理：**
- [ ] 外部 URL 图片已下载本地化，无依赖他人图床的链接
- [ ] 已运行 `compress_images.py`，图片全部转为 `.webp`
- [ ] 已运行 `search_unused_images.py`，未使用的图片已清理
- [ ] 无死链或引用了不存在的图片路径
