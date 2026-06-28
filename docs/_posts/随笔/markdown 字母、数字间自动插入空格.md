---
title: markdown 字母、数字间自动插入空格
date: 2024-05-02 17:41:37
permalink: /pages/c58665/
sidebar: auto
categories: 
  - 随笔
tags:
  - 
author: 
  name: bombax
  link: https://github.com/coderofmutou
---

# markdown 字母、数字间自动插入空格

## 介绍

[Textlint](https://textlint.github.io/) 是一个用 JavaScript 编写的开源文本 lint 工具，支持对文本和 Markdown 文件进行规则检查和自动修复。

## 使用

1. 创建项目

    ```bash
    npm init --yes
    ```

2. 安装 textlint

    ```bash
    npm install --save-dev textlint
    ```

3. 安装 textlint 规则

    ```bash
    npm install --save-dev textlint-rule-no-todo
    ```

4. 创建.textlintrc 文件

    ```bash
    npx textlint --init
    ```

5. 运行 textlint

    ```bash
    npx textlint README.md
    ```

6. 自动修复问题

    ```bash
    npx textlint --fix README.md
    ```

## 常用规则

[Collection-of-textlint-rule](https://github.com/textlint/textlint/wiki/Collection-of-textlint-rule)

## 推荐规则

### textlint-rule-alive-link

检查所有链接是否可用。

### [textlint-rule-ja-space-between-half-and-full-width](https://github.com/textlint-ja/textlint-rule-preset-ja-spacing/blob/master/packages/textlint-rule-ja-space-between-half-and-full-width/README.md)

检测半角字符和全角字符之间是否有空格

1. 安装

    ```bash
    npm install --save-dev textlint-rule-ja-space-between-half-and-full-width
    ```

2. 使用

    在 .textlintrc 中添加（推荐）

    ```json
    {
        "rules": {
            "ja-space-between-half-and-full-width": {
                "space": "never"
            }
        }
    }
    ```

3. 选项

    - `space`: "always" || "never" || string[]
        - 默认值: `never`
        - 总是空格（`always`）或不空格（`never`）

        - 也可以使用 Array 格式: [`alphabets`, `numbers`, `punctuation`]
            - 只指定想要的对象
            - 例如，如果希望将数字和标点符号(、。)视为例外:["alphabets"]

    - ...

    ```json
    {
        "rules": {
            "ja-space-between-half-and-full-width": {
                "space": "always"
            }
        }
    }
    ```

### [textlint-rule-zh-half-and-full-width-bracket](https://github.com/ylc395/textlint-rule-zh-half-and-full-width-bracket)

检测是否正确地使用了全角或半角括号。默认情况下，半角和全角之间没有空格。("never")

1. 安装

    ```bash
    npm install --save-dev textlint-rule-zh-half-and-full-width-bracket
    ```

2. 使用

    在 .textlintrc 中添加（推荐）

    ```json
    {
      "rules": {
        "zh-half-and-full-width-bracket": true
      }
    }
    ```

3. 选项

    - `"halfWidth"`：一律使用半角括号
    - `"fullWidth"`：一律使用全角括号
    - `"mixed"`：括号内有中文的情况下，使用中文全角括号；括号内是全英文、数字的情况下，使用英文半角括号

    ```json
    {
      "rules": {
        "zh-half-and-full-width-bracket": {
        // type of brackets you want
        // 选择你需要的括号类型
          "bracket": "halfWidth"
        }
      }
    }
    ```

    