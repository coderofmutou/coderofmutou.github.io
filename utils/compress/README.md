# 图片处理命令集合

本目录包含知识库图片处理工具，统一为 4 个 `kb:*` 命令。

## 命令

| 命令 | 用途 | 示例 |
|------|------|------|
| `kb:download` | 外链图片本地化 | `npm run kb:download ./docs/01.Java/10.基础.md` |
| `kb:compress` | 本地图片压缩为 webp，更新 md 引用 | `npm run kb:compress ./docs/01.Java/10.基础.md` |
| `kb:scan` | 扫描未使用图片 | `npm run kb:scan ./docs` |
| `kb:all` | 单篇流水线：download → compress → scan | `npm run kb:all ./docs/01.Java/10.基础.md` |

## 输入支持

`<md输入>` 支持以下形式：

- 单个文件：`./docs/01.Java/10.基础.md`
- 多个文件：需要 Shell 支持多参数传递
- glob：`./docs/01.Java/**/*.md`
- 目录：`./docs/01.Java`（递归处理该目录下所有 `.md`）

## 参数说明

所有命令均可直接用 `node <脚本>.mjs <参数>` 运行，`npm run kb:*` 只是等价别名。
约定：`<必选>` 表示必填，`[可选]` 表示可省略。

### kb:download（download.mjs）

```
node download.mjs <md输入> [assets目录]
```

| 参数 | 必选 | 说明 |
|------|------|------|
| `<md输入>` | 是 | 要处理的 md 文件/目录/glob，支持多形式见上 |
| `[assets目录]` | 否 | 图片保存目录。省略时按优先级自动探测：① 同目录下 `<篇名>.assets`/`.images`/`.imgs`/`.pics`；② 同目录下共享的 `images`/`imgs`/`pics`；③ 都没有则新建 `<篇名>.assets` |

- 只下载 `http://https://` 外链图片，本地引用不动
- 下载并发上限 8，单张超时 15s
- 有任一图片下载失败 → 退出码 1（仍写出已成功替换的 `*_new.md`）
- 无外链或无变化 → 不生成 `*_new.md`

### kb:compress（compress.mjs）

```
node compress.mjs <md输入> [图目录]
```

| 参数 | 必选 | 说明 |
|------|------|------|
| `<md输入>` | 是 | 要处理的 md 文件/目录/glob |
| `[图目录]` | 否 | 限定只处理该目录内的图片。省略时按 md 引用自动定位，凡被引用且存在的图片都处理 |

- 将 `.png`/`.jpg`/`.jpeg`/`.gif`/`.bmp` 转为 `.webp`（quality=75），已是 webp 或不支持的格式跳过
- 原图移到图片同目录的 `backup/` 下，同名自动加时间戳后缀避免覆盖
- `.svg` 不压缩
- 绝对路径引用（`/img/x.png`）会跳过并告警
- 无变化 → 不生成 `*_new.md`

### kb:scan（scan.mjs）

两种互斥模式，由第一个参数决定：

**全仓库模式**

```
node scan.mjs <docs根目录>
```

| 参数 | 必选 | 说明 |
|------|------|------|
| `<docs根目录>` | 是 | 知识库根目录，递归扫描其下所有 md 与图片 |

建立「图片 → 引用它的 md」反向索引，输出三类：全仓库未引用、仅 1 篇引用、多篇引用。

**单篇模式**

```
node scan.mjs --local=<md文件> [扫描范围]
```

| 参数 | 必选 | 说明 |
|------|------|------|
| `--local=<md文件>` | 是 | 单篇 md 路径，须写成 `--local=路径` 形式 |
| `[扫描范围]` | 否 | 额外纳入扫描的目录。省略时默认扫描：md 同目录 + 引用指向的目录 + 自动探测的 assets 目录 |

- 只输出报告，**不删除任何图片**
- 单篇「未引用」仅供参考，可能被其他文章引用

### kb:all（image-pipeline.mjs）

```
node image-pipeline.mjs <md输入> [assets目录]
```

| 参数 | 必选 | 说明 |
|------|------|------|
| `<md输入>` | 是 | 要处理的 md 文件/目录/glob |
| `[assets目录]` | 否 | 透传给 download 阶段作为图片保存目录，语义同 kb:download |

执行 `download → compress → scan --local` 三阶段，中间产物为 `<篇名>_working.md`，最终输出 `<篇名>_new.md`。

- 任一阶段失败只告警不中断，继续后续阶段
- 整条流水线无任何改动 → 删除 `_working.md`，不产出 `*_new.md`

## 退出码

| 退出码 | 含义 |
|--------|------|
| 0 | 全部成功，或仅有跳过（已是 webp / 无外链等正常情况） |
| 1 | 输入解析失败，或部分图片下载失败，或运行时抛错 |

## 安全设计

- 所有写操作都生成 `*_new.md`，**不覆盖原 md 文件**
- `kb:compress` 将原图移到各自目录的 `backup/` 下
- `kb:scan` 只输出报告，**不自动删除任何图片**
- 压缩质量固定为 `quality=75`

## 各命令详细说明

### kb:download

将 md 中的 `http/https` 外链图片下载到本地 assets 目录。

```bash
npm run kb:download ./docs/01.Java/10.基础.md
# 默认保存到 ./docs/01.Java/10.基础.assets/

npm run kb:download ./docs/01.Java/10.基础.md ./docs/01.Java/images/
# 保存到指定目录
```

### kb:compress

根据 md 中的图片引用，将本地 `.png` / `.jpg` / `.jpeg` / `.gif` / `.bmp` 压缩为 `.webp`。

```bash
npm run kb:compress ./docs/01.Java/10.基础.md
# 自动根据 md 引用定位图片

npm run kb:compress ./docs/01.Java/10.基础.md ./docs/01.Java/10.基础.assets/
# 只处理该目录下被引用的图片
```

支持解析：
- Markdown 图片语法：`![alt](path)`
- HTML img 标签：`<img src="path">`
- frontmatter 中字符串形式的图片字段

### kb:scan

#### 全仓库模式

```bash
npm run kb:scan ./docs
```

建立反向索引，输出：
- 全仓库未引用图片（可考虑删除）
- 仅 1 篇文章引用的图片
- 多篇文章引用的图片

#### 单篇模式

```bash
npm run kb:scan --local=./docs/01.Java/10.基础.md
```

扫描 md 文件附近（同目录 + 引用指向目录）的图片，输出本篇未引用的图片。

### kb:all

单篇流水线：`download → compress → scan --local`。

```bash
npm run kb:all ./docs/01.Java/10.基础.md
```

## 旧脚本

原 `utils/compress/` 下的旧脚本已归档到 `archive/` 目录，保留半年观察期。如需恢复，请从 git 历史找回。

## 测试

```bash
npm run kb:test
```
