---
name: vdoing-knowledge-base
description: "维护基于 vuepress-theme-vdoing 的 Java 学习知识库总体结构。Use when: 新增笔记文档、更新 docs/.vuepress/config.ts 导航、添加目录页、完善 frontmatter 与 permalink、发布前质量验收、编写 Git commit message、不确定该用哪个子技能时作为统一入口。"
argument-hint: "描述你想做的事，例如：新增 Spring Security 6 笔记、整合 Redis 多份课程笔记、处理该文档中的外链图片并转 webp"
---

# VuePress Vdoing 知识库维护

本知识库基于 [vuepress-theme-vdoing](https://doc.xugaoyi.com/)，部署于 `docs/` 目录下，域名信息从 `docs/.vuepress/public/CNAME` 读取，主配置文件为 `docs/.vuepress/config.ts`。

## 使用场景

- 新增某个技术主题的笔记文档
- 将一份或多份他人原始笔记整合为自己的个人笔记（含外部图片下载本地化）
- 更新 `config.ts` 中的导航栏（nav）配置
- 新增目录页（Catalogue Page）
- 优化已有文档的 frontmatter 或内容结构
- 处理笔记图片：批量转 webp、清理未使用图片
- 排查图片加载、路径等常见问题

## 技能调度关系（建议）

本技能建议作为**总入口/调度层**使用，不建议删除。详见 [Skills 总览](../README.md)。

| 任务类型 | 转入子技能 |
|----------|-----------|
| 多来源资料整合为一篇笔记 | [java-note-synthesis](../java-note-synthesis/SKILL.md) |
| 图片下载/本地化/转 webp/清理 | [knowledge-image-pipeline](../knowledge-image-pipeline/SKILL.md) |
| 新增文档 / 导航 / frontmatter / 目录页 | 本技能直接处理 |

**混合任务执行顺序：**

1. `java-note-synthesis` 处理正文结构与整合
2. `knowledge-image-pipeline` 处理图片资产
3. 本技能完成导航、目录页、Git 提交规范收尾

## 输入与产出

### 输入建议

- 目标动作（新增 / 整合 / 更新 / 图片治理 / 导航维护）
- 目标文件或目录（例如 `docs/03.微服务生态/10.安全框架/`）
- 是否需要保留原有 permalink（默认保留）
- 是否需要同步更新导航与目录页

### 标准产出

- 修改后的 Markdown 文档（结构化、去噪、可检索）
- 规范化 frontmatter（标题、时间、permalink、分类、标签、作者）
- 图片资源落盘到同级 `.assets/`，并优先 `.webp`
- 必要时同步更新 `docs/.vuepress/config.ts` 与目录页

---

## 一、新增笔记文档

### 1. 确定存放路径

参照目录结构规范：

```
docs/
  {序号}.{一级分类}/
    {序号}.{二级分类}/
      {序号}.{文章标题}.md
```

- 文件夹与文件名均以 **两位数字+英文点** 开头（如 `01.`、`10.`），数字控制侧边栏排序。
- 一级分类对应 `docs/00.目录页/` 中的目录页文件和 `config.ts` 中的 nav 条目。

### 2. 编写 frontmatter

参见 [frontmatter 模板](./references/frontmatter-template.md)。

**普通文章 frontmatter 最小集：**

```yaml
---
title: {标题（中文，与 H1 一致）}
date: {YYYY-MM-DD HH:mm:ss}
permalink: /{kebab-case 路径}/
categories:
  - {一级分类中文名}
  - {二级分类中文名（可选）}
tags:
  - {标签1}
author:
  name: bombax
  link: https://github.com/coderofmutou
---
```

`permalink` 规则：
- 使用小写英文 + 连字符，无中文，格式与 config.ts 中 nav 的 link 对齐
- 例：`/micro-service-core/MyBatis/`

### 3. 文章内容结构

```markdown
# {与 title 一致的 H1 标题}

## {一级章节}

### {二级章节}

> 重要提示、原文摘录用引用块

代码块注明语言（```java, ```xml, ```yaml 等）

图片统一存放在同级的 `{文档名}.assets/` 文件夹下，并转换为 `.webp` 格式。
```

### 4. 更新导航（config.ts）

若新增的是一个新的一级导航入口，参见 [config.ts 导航维护指南](./references/config-guide.md)。

---

## 二、整合多份笔记为个人文档

### 整体流程

```
读取原始资料 → 下载外部图片本地化 → 提炼知识骨架 → 逐节精简整合 → 补充个人理解 → 规范化输出
```

详细步骤参见 [笔记整合工作流](./references/note-synthesis.md)。

### 快速原则

1. **去重优先**：多份资料中重复覆盖的概念，只保留一份最清晰的表述。
2. **去噪处理**：删除与主题无关的营销语言、课程广告、讲师介绍、无关截图。
3. **结构统一**：按「是什么 → 为什么 → 怎么用 → 注意事项」组织每个知识点。
4. **代码优先**：有代码示例的，优先保留代码，删去纯文字复述。
5. **个人批注**：对原文有疑问或补充的，用 `> 💡 个人注：...` 的引用格式标注。

### 决策分支（整合时必看）

- **资料冲突时**：
  - 以官方文档/新版本语义为准；旧版本内容保留并标注版本边界。
- **示例代码重复时**：
  - 保留最短可运行示例，复杂示例放折叠或拆分到子节。
- **图片过多时**：
  - 保留必要流程图和结果图，删除重复截图与无信息增量图片。
- **篇幅过长时（>500 行）**：
  - 按主题拆分子文件，并在主文档增加目录与跳转。

---

## 三、更新已有笔记

覆盖场景：技术版本升级、补充遗漏内容、修正错误、单文件拆分为多文件。

详细操作参见 [已有笔记更新维护指南](./references/note-maintenance.md)。

**版本共存核心原则：**
- 旧版本仍有使用价值 → **新旧内容都保留**，明确标注版本范围，不替换
- 差异较小 → 同节内用 `> **X.x 差异**：` 引用块标注
- Breaking Change → 章节标题加版本括注，如 `## 安全配置（Spring Security 6.x）`
- 差异极大 → 文件级分离，文件名含版本信息
- `permalink` 一旦发布不要轻易修改（会造成死链）
- 单文件超过 500 行考虑按章节拆分

---

## 四、目录页（Catalogue Page）

每个一级分类在 `docs/00.目录页/` 下对应一个目录页文件：

```yaml
---
pageComponent:
  name: Catalogue
  data:
    path: {对应的文件夹名，如 01.Java基础}
title: Java基础
date: {YYYY-MM-DD HH:mm:ss}
permalink: /java-basic/
sidebar: false
article: false
comment: false
editLink: false
author:
  name: bombax
  link: https://github.com/coderofmutou
---
```

---

## 五、质量门禁（完成标准）

在交付前逐项核对：

- [ ] 标题与 `frontmatter.title` 一致，且只有一个 H1
- [ ] `permalink` 唯一、稳定、无中文路径
- [ ] 分类与标签可反映主题（如 Java、Spring、MyBatis、Redis）
- [ ] 代码块均带语言标识（`java`、`xml`、`yaml`、`bash` 等）
- [ ] 图片链接均可访问，优先本地化且路径使用相对引用
- [ ] 涉及新增栏目时，`docs/.vuepress/config.ts` 与目录页已同步
- [ ] 文档无明显广告噪声、重复段落和失效链接

---

## 六、Git 提交规范

每次操作完成后，参见 [Git Commit Message 规范](./references/git-commit-guide.md) 编写提交信息。

**常用格式速查：**

| 操作 | commit 示例 |
|------|------------|
| 新增笔记 | `新增 Spring Security 笔记` |
| 新增系列章节 | `新增 JavaWeb 技术笔记（第07章）` |
| 整合他人笔记 | `新增 Redis 笔记，整合自尚硅谷教程` |
| 图片本地化+转webp | `优化 MyBatis 笔记图片，本地化外链并转换为 webp` |
| 更新已有笔记 | `更新 MyBatis 笔记，补充动态 SQL 章节` |
| 更新导航菜单 | `更新导航菜单，新增 Redis 子项` |

---

## 七、常见问题排查

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 图片不显示 | 路径含中文 | 图片文件夹改为英文命名，或使用 `markdown-it-disable-url-encode` 插件 |
| 侧边栏顺序乱 | 文件名数字前缀不规范 | 确保文件夹/文件以 `{两位数}.` 开头 |
| 目录页空白 | `pageComponent.data.path` 与文件夹名不匹配 | 检查 `path` 是否与 `docs/` 下的实际文件夹名完全一致 |
| 新文章不在导航中 | `config.ts` nav 未更新 | 按照 [config.ts 导航维护指南](./references/config-guide.md) 添加条目 |
| permalink 冲突 | 多个文件使用了相同路径 | 确保所有 permalink 全局唯一 |
