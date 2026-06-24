# 工具命令速查表

本仓库 `utils/` 下三套工具包，均通过 `npm run` 暴露稳定命令名。

> 所有写操作都生成 `*_new.md`，**不覆盖原文件**；压缩类操作把原图移入 `backup/`。删除类操作**永远只报告不删除**。

> **关于退出码噪声**：`md:check` / `kb:lint` 等检查命令**发现问题时退出码为 1**（设计行为），npm 会接着打印一段 `npm error Lifecycle script failed` 堆栈——这是正常的，看命令上方的实际报告即可，并非命令崩溃。无问题时退出码 0。

---

## 一、compress 包（图片处理流水线）

执行目录：`utils/compress/`

| 命令 | 用途 | 输入 | 输出 | 副作用 |
|------|------|------|------|--------|
| `kb:download` | 外链图片本地化 | `<md输入>` `[assets目录]` | `*_new.md` + 下载的图片 | http/https 图下载到本地；下载失败保留原 url |
| `kb:compress` | 本地图片转 webp | `<md输入>` `[图目录]` | `*_new.md` + webp 文件 | 原图移入 `backup/`（时间戳防覆盖）；已是 webp/svg 跳过；绝对路径告警不处理 |
| `kb:scan` | 扫描未使用/多引用图片 | `<docs根>` 或 `--local=<md>` `[范围]` | 纯文本报告 | 仅报告，**不删除** |
| `kb:convert` | `<img>` 转 Markdown 语法 | `<md输入>` | `*_new.md` | 相对路径、非代码块内的 `<img>` 转换；绝对路径/外链/代码块内跳过 |
| `kb:all` | 单篇全流程 | `<md文件>` `[assets目录]` | `*_new.md`（最终） | 串行 download → convert → compress → scan --local；任一步失败不中断 |
| `kb:test` | 跑 compress 包单测 | 无 | 测试结果 | 无 |

**`<md输入>` 支持形式**：单文件、多文件、glob（`docs/01.Java/**/*.md`）、目录（递归）。

**`[assets目录]` 省略时自动探测优先级**：① 同级 `<篇名>.assets`；② 同级共享 `images`；③ 新建 `<篇名>.assets`。

**`kb:scan` 两种粒度**：
- 全仓库模式 `kb:scan <docs根>`：建反向索引，输出「全仓库未引用（可考虑删除）」「仅 1 篇引用」「多篇引用」三段报告 + 绝对路径图片告警。
- 单篇模式 `kb:scan --local=<md>`：只报告本篇未引用图片（可能被其他文章引用，**不附删除建议**）+ 绝对路径图片告警。

```bash
cd utils/compress
npm run kb:download -- ../../docs/02.微服务核心/50.持久层框架/10.MyBatis.md
npm run kb:compress -- ../../docs/02.微服务核心/50.持久层框架/10.MyBatis.md
npm run kb:scan -- ../../docs                              # 全仓库
npm run kb:scan -- --local=../../docs/04.实用工具/10.Git.md # 单篇（注意 -- 传参）
npm run kb:all -- ../../docs/04.实用工具/10.Git.md
npm run kb:test
```

---

## 二、normalize 包（Markdown 结构归一化）

执行目录：`utils/normalize/`。与 VuePress 无关，通用于任何 Markdown 文档。

| 命令 | 用途 | 输入 | 输出 | 副作用 |
|------|------|------|------|--------|
| `md:check` | 检查结构问题 | `<md输入>` | 控制台报告 | 不修改文件；退出码 0 无问题 / 1 有问题 |
| `md:fix` | 自动修复结构问题 | `<md输入>` | `*_new.md` | 不覆盖原文件 |

**检查/修复项**：
- ✅ fix：列表符号后缺空格（`-项目`→`- 项目`、`1.项目`→`1. 项目`，排除 `---`/小数/版本号）
- ✅ fix：标题前后缺空行
- ✅ fix：超过 2 个连续空行压缩为 2 个
- ✅ fix：多个 H1（仅报告，不合并）
- ⚠️ 仅报告：绝对路径图片引用（`/img/x.png`、`C:\...`）
- 🛡️ 围栏代码块（``` / ~~~）内容受保护，不被误改；CRLF 行尾保留

```bash
cd utils/normalize
npm run md:check -- ../../docs/04.实用工具/10.Git.md
npm run md:fix -- ../../docs/04.实用工具/10.Git.md
node --test tests/                    # 跑单测（包内无 test 脚本，直接 node --test）
```

---

## 三、textlint 包（中英文混排排版）

执行目录：`utils/textlint/`。基于两条规则自动修复间距，覆盖 textlint 能力边界内的排版问题。

| 命令 | 用途 | 输入 | 副作用 |
|------|------|------|--------|
| `kb:lint` | 全仓库扫描间距问题 | `docs/**/*.md` | 只报告，不修改 |
| `kb:lint:fix` | 全仓库自动修复 | `docs/**/*.md` | **直接覆盖原文件** |
| `kb:lint:one` | 单文件扫描 | `<文件路径>` | 只报告 |
| `kb:lint:one:fix` | 单文件自动修复 | `<文件路径>` | **直接覆盖原文件** |

**已启用规则**：
- `ja-space-between-half-and-full-width`：全角（中文）与半角（英文/数字）间补空格。`这是AI` → `这是 AI`
- `ja-space-around-code`：行内代码前后补空格。`使用`npm`命令` → `使用 `npm` 命令`

```bash
cd utils/textlint
npm run kb:lint                              # 全仓库扫描
npm run kb:lint:fix                          # 全仓库修复（覆盖原文件）
npm run kb:lint:one -- ../../docs/04.实用工具/10.Git.md
npm run kb:lint:one:fix -- ../../docs/04.实用工具/10.Git.md
```

> ⚠️ `kb:lint:fix` 直接覆盖原文件，跑前建议 `git status` 确认工作区干净，便于回滚。
> textlint 修不到的盲区（`**加粗**` 边界间距、全角/半角标点选择、代码块内）见 [排版规范](./typography-rules.md)。

---

## 四、根目录独立脚本

| 命令 | 脚本 | 用途 | 触发方式 |
|------|------|------|---------|
| `npm run editFm` | `utils/editFrontmatter.js` | 配 `utils/config.yml` 批量改 frontmatter（基本用不到，单篇手改） | 手动调用 |
| `npm run dev` / `npm run build` | — | 本地预览 / 构建 | `predev`/`prebuild` 钩子自动先跑 `utils/check.js` 做环境检查 |
| `npm run baiduPush` | `utils/baiduPush.js` | 百度推送 | 手动调用 |

`check.js` 在 `dev`/`build` 前自动执行，无需手动跑。

---

## 五、场景 → 命令映射

| 场景 | 推荐命令 |
|------|---------|
| 新增笔记后检查结构 | `md:check` → `kb:lint:one` |
| 整合他人笔记（含外链图） | `kb:all`（download→convert→compress→scan） |
| 只下载外链图片 | `kb:download` |
| 只转 webp | `kb:compress` |
| 清理前查未使用图片 | `kb:scan`（全仓库）或 `kb:scan --local=`（单篇） |
| 全仓库排版修复 | `kb:lint:fix` |
| 全仓库健康体检（发布前） | `md:check docs` → `kb:lint` → `kb:scan docs` → `npm run build` |
| 跑工具链回归测试 | compress `kb:test` + normalize `node --test tests/` |
