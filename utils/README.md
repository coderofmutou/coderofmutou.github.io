# utils 工具集

知识库维护脚本，偶尔手动或由 `.claude/skills` 调用执行一次。只做文档本身的结构/资产处理，不涉及笔记编写与内容整合（那是 skill 的职责）。

## 包一览

| 包 | 作用 | 入口命令 |
|----|------|----------|
| `compress/` | 图片资产处理：外链本地化、`<img>` 转 markdown、压缩 webp、扫描未引用图片 | `kb:*` |
| `normalize/` | Markdown 结构归一化：列表空格、标题空行、连续空行、多 H1、绝对路径图片 | `md:check` / `md:fix` |
| `textlint/` | 全角/半角与代码周围空格规整（textlint 规则） | `kb:lint` / `kb:lint:fix` |

`utils/` 根目录下的 `baiduPush.js`、`check.js`、`editFrontmatter.js`、`modules/` 为早期独立脚本，未被上述命令体系取代，按需直接 `node` 运行。

---

## compress（图片资产处理）

5 个 `kb:*` 命令，均可用 `npm run kb:<命令>` 或 `node <脚本>.mjs` 运行。`cd utils/compress` 后执行。

| 命令 | 用途 | 示例 |
|------|------|------|
| `kb:download` | 外链图片本地化 | `npm run kb:download ./docs/01.Java/10.基础.md` |
| `kb:compress` | 本地图片压缩为 webp，更新 md 引用 | `npm run kb:compress ./docs/01.Java/10.基础.md` |
| `kb:scan` | 扫描未使用图片 / 绝对路径引用 | `npm run kb:scan ./docs` |
| `kb:all` | 单篇流水线：download → convert → compress → scan | `npm run kb:all ./docs/01.Java/10.基础.md` |
| `kb:convert` | 将文档中 `<img>` 标签转为 `![]()` 语法 | `npm run kb:convert ./docs/01.Java/10.基础.md` |

### 输入支持

`<md输入>` 支持以下形式：单个文件、多个文件、glob（`./docs/01.Java/**/*.md`）、目录（递归处理该目录下所有 `.md`）。约定：`<必选>` 表示必填，`[可选]` 表示可省略。

### kb:download（download.mjs）

```
node download.mjs <md输入> [assets目录]
```

- 只下载 `http/https` 外链图片，本地引用不动；下载并发上限 8，单张超时 15s
- `[assets目录]` 省略时按优先级自动探测：① 同目录下 `<篇名>.assets`（兼容去掉序号前缀的篇名）；② 同目录下共享的 `images`；③ 都没有则新建 `<篇名>.assets`
- 有任一图片下载失败 → 退出码 1（仍写出已成功替换的 `*_new.md`）；无外链或无变化 → 不生成 `*_new.md`

### kb:compress（compress.mjs）

```
node compress.mjs <md输入> [图目录]
```

- 将 `.png`/`.jpg`/`.jpeg`/`.gif`/`.bmp` 转为 `.webp`（quality=75），已是 webp 或不支持的格式跳过；`.svg` 不压缩
- 原图移到图片同目录的 `backup/` 下，同名自动加时间戳后缀避免覆盖
- `[图目录]` 限定只处理该目录内的图片；省略时按 md 引用自动定位，凡被引用且存在的图片都处理
- 绝对路径引用会跳过并告警；无变化 → 不生成 `*_new.md`
- 支持解析 Markdown 图片语法、HTML `<img>` 标签、frontmatter 中字符串形式的图片字段

### kb:scan（scan.mjs）

两种互斥模式，由第一个参数决定。**只输出报告，不删除任何图片。**

全仓库模式：`node scan.mjs <docs根目录>` — 建立「图片 → 引用它的 md」反向索引，输出全仓库未引用、仅 1 篇引用、多篇引用三类。

单篇模式：`node scan.mjs --local=<md文件> [扫描范围]` — 扫描 md 附近（同目录 + 引用指向目录 + 自动探测的 assets 目录）的图片，输出本篇未引用的图片（仅供参考，可能被其他文章引用）。`[扫描范围]` 可额外纳入扫描的目录。

两种模式都会额外报告文档中的绝对路径图片引用（`/` 开头或 Windows 盘符）。

### kb:all（image-pipeline.mjs）

```
node image-pipeline.mjs <md输入> [assets目录]
```

执行 `download → convert → compress → scan --local` 四阶段，中间产物为 `<篇名>_working.md`，最终输出 `<篇名>_new.md`。任一阶段失败只告警不中断；整条流水线无任何改动 → 删除 `_working.md`，不产出 `*_new.md`。`[assets目录]` 透传给 download 阶段。

### kb:convert（convert-html-img.mjs）

```
node convert-html-img.mjs <md输入>
```

将 md 中符合条件的 `<img src="...">` 标签转为 Markdown `![alt](src)` 语法，方便 VuePress 统一处理路径、URL 编码和懒加载。

**只转换：** `src` 是相对路径、不在代码块内、没有 `data-*` 属性或 `width`/`height` 数值属性。
**跳过：** `src` 为外链或 `/` 开头/盘符绝对路径、含 `data-src` 等非标准属性（教学示例代码）、代码块内的 `<img>`。

通常在 `kb:download` 之后、`kb:compress` 之前运行。

### 退出码

| 退出码 | 含义 |
|--------|------|
| 0 | 全部成功，或仅有跳过（已是 webp / 无外链等正常情况） |
| 1 | 输入解析失败，或部分图片下载失败，或运行时抛错 |

### 安全设计

- 所有写操作都生成 `*_new.md`，**不覆盖原 md 文件**
- `kb:compress` 将原图移到各自目录的 `backup/` 下
- `kb:scan` 只输出报告，**不自动删除任何图片**
- 压缩质量固定为 `quality=75`

测试：`cd utils/compress && npm run kb:test`

---

## normalize（Markdown 结构归一化）

`cd utils/normalize` 后执行：

```bash
npm run md:check ./docs/01.Java/10.基础.md   # 只报告，不修改
npm run md:fix   ./docs/01.Java/10.基础.md   # 修复可自动化项，输出 *_new.md
```

检查/修复项：

- 列表符号后缺空格（`-`/`数字.`，排除 `---`、小数、版本号）
- 标题前后缺空行
- 超过 2 个连续空行
- 多个 H1
- 绝对路径图片引用（`C:\` 或 `/` 开头，只报告）

围栏代码块（``` / ~~~）内容受保护，不被误改；CRLF 行尾保留。`fix` 不覆盖原文件，产出 `*_new.md`；`check` 发现问题时退出码 1。

测试：`cd utils/normalize && npm test`

---

## textlint（全角/半角与代码空格规整）

`cd utils/textlint` 后执行：

```bash
npm run kb:lint              # 扫描 ../../docs/**/*.md
npm run kb:lint:fix          # 自动修复
npm run kb:lint:one <文件>    # 单文件
npm run kb:lint:one:fix <文件>
```

规则（`.textlintrc.json`）：

- `ja-space-between-half-and-full-width`：全角与半角字符间补空格
- `ja-space-around-code`：行内代码前后补空格
