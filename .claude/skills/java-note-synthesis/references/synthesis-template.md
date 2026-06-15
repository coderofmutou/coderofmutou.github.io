# Java 笔记整合模板

可用于从 0 到 1 整合任意 Java 技术主题。

## 建议结构

```markdown
# {主题标题}

## 1. 是什么

## 2. 为什么

## 3. 怎么做

### 3.1 核心配置

### 3.2 最小示例

## 4. 常见问题与排错

## 5. 版本差异

## 6. 最佳实践
```

## frontmatter 最小集

```yaml
---
title: {标题}
date: {YYYY-MM-DD HH:mm:ss}
permalink: /{english-path}/
categories:
  - {一级分类}
tags:
  - {标签}
author:
  name: bombax
  link: https://github.com/coderofmutou
---
```

## 快速检查

- [ ] 仅一个 H1
- [ ] 代码块均含语言标识
- [ ] 版本范围有标注
- [ ] 链接有效且无广告噪声
