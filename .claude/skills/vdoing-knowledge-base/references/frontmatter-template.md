# Frontmatter 模板参考

---

## 普通文章（最常用）

```yaml
---
title: {中文标题，与文章 H1 保持一致}
date: 2025-01-01 12:00:00
permalink: /{一级路径}/{二级路径}/
categories:
  - {一级分类，如：Java基础}
  - {二级分类，如：Java从入门到精通(JDK17版)}
tags:
  - {标签1，如：Java}
  - {标签2，如：JDK17}
author:
  name: bombax
  link: https://github.com/coderofmutou
---
```

**permalink 路径规则：**
- 全部小写英文 + 连字符（kebab-case）
- 与 `config.ts` 的 nav `link` 字段保持一致
- 系列笔记最后一级加章节路径，如：`/java-basic/java-from-entry-to-proficiency/chapter-1/`
- 独立文章可用 `/pages/{自定义字符串}/` 格式（如：`/pages/pojo/`）

---

## 目录页（Catalogue Page）

存放于 `docs/00.目录页/` 下，文件名如 `00.java基础.md`：

```yaml
---
pageComponent:
  name: Catalogue
  data:
    path: 01.Java基础
title: Java基础
date: 2024-04-02 21:18:03
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

> `path` 字段必须与 `docs/` 下的实际**文件夹名**（含数字前缀）完全一致。

---

## 随笔（_posts 文件夹）

存放于 `docs/_posts/随笔/` 下，无需数字前缀排序：

```yaml
---
title: {标题}
date: 2024-05-02 17:41:37
permalink: /pages/{自定义字符串}/
sidebar: auto
categories:
  - 随笔
tags:
  - {标签}
author:
  name: bombax
  link: https://github.com/coderofmutou
---
```

---

## @pages 特殊页面（归档/分类/标签）

存放于 `docs/@pages/` 下，一般不需手动修改：

```yaml
---
pageComponent:
  name: Archives        # 或 Categories / Tags
title: 归档
permalink: /archives/
article: false
comment: false
editLink: false
---
```

---

## 字段说明速查

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | ✅ | 页面标题，显示于侧边栏和浏览器 tab |
| `date` | ✅ | 创建时间，用于归档排序，格式 `YYYY-MM-DD HH:mm:ss` |
| `permalink` | ✅ | 永久链接，一旦发布不要修改 |
| `categories` | ✅（普通文章）| 分类，最多两级，与目录结构对应 |
| `tags` | ⬜ | 标签，可为空数组 `[]` |
| `author` | ✅ | 作者，项目默认 bombax |
| `sidebar` | ⬜ | 目录页设为 `false`；随笔可设为 `auto` |
| `article` | ⬜ | 设为 `false` 表示非文章页（不参与归档） |
| `comment` | ⬜ | 设为 `false` 关闭评论 |
| `editLink` | ⬜ | 设为 `false` 隐藏编辑链接 |
| `pageComponent` | ⬜ | 特殊页面组件，目录页使用 `Catalogue` |
