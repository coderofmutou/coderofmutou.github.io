---
title: vuepress 中文路径会导致图片加载失败
date: 2024-04-03 00:46:40
permalink: /pages/e641ae/
sidebar: auto
categories:
  - 随笔
tags:
  - 
author: 
  name: bombax
  link: https://github.com/coderofmutou
---

# vuepress 中文路径会导致图片加载失败
## 问题描述
在引入静态资源的时候，如果路径中存在中文会导致加载失败，例如引入一张图片：
```text
![image](/图片/1.png)
```

## 解决方法
1. 安装 markdown-it-disable-url-encode
```shell
npm install markdown-it-disable-url-encode
```
2. config.ts引入模块
```ts
import markdownItDisableUrlEncode from 'markdown-it-disable-url-encode';

export default defineConfig4CustomTheme<VdoingThemeConfig>({
    markdown: {
        // ...
        extendMarkdown: md => {
            md.use(markdownItDisableUrlEncode);
        }
    }
})
```