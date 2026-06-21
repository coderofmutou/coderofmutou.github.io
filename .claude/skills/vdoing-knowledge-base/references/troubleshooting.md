# 常见问题排查

知识库维护高频问题与解决方案。

---

## 一、图片相关问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 图片不显示 | 路径含中文，部署环境编码差异 | 图片文件名改英文/拼音；或启用 `markdown-it-disable-url-encode` 插件 |
| 图片不显示 | 用了绝对路径（`/img/x.png`、`C:\...`） | 跑 `kb:scan` 定位绝对路径引用，手动改为相对路径 |
| 图片不显示 | 外链图床失效（404） | `kb:download` 本地化，见 [图片处理](./image-pipeline.md) |
| 图片不显示 | 路径大小写不一致 | 统一大小写，Windows 不敏感但 Linux 部署敏感 |
| 构建慢/仓库大 | 图片未转 webp | `kb:compress` 批量转 webp |
| 仓库膨胀 | 残留未使用图片 | `kb:scan`（全仓库）出报告，人工确认后删 |
| `backup/` 占空间 | 压缩后原图备份堆积 | 确认 webp 无误后定期清理 `backup/` |

### 绝对路径图片检测

从他人笔记迁移的图片引用常带绝对路径，VuePress 无法正确处理。`kb:scan` 和 `md:check` 都会报告：

```bash
cd utils/compress
npm run kb:scan -- ../../docs                    # 全仓库报告绝对路径引用
# 或
cd utils/normalize
npm run md:check -- ../../docs/01.Java/10.基础.md # 单篇检查
```

报告形如：`行 42 [markdown] /docs/03.微服务生态/.../result.png`，按行号手动改为相对路径。

---

## 二、导航与结构问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 侧边栏顺序乱 | 文件名数字前缀不规范 | 文件夹/文件以 `{两位数}.` 开头（如 `01.`、`10.`） |
| 目录页空白 | `pageComponent.data.path` 与文件夹名不匹配 | 检查 `path` 是否与 `docs/` 下实际文件夹名（含数字前缀）完全一致 |
| 新文章不在导航中 | `config.ts` nav 未更新 | 按 [config.ts 导航维护指南](./config-guide.md) 添加条目 |
| permalink 冲突 | 多文件用了相同路径 | 全局唯一，发布后不轻易改（死链） |
| 侧边栏不显示 H4+ | `sidebarDepth: 2` | 只显示到 H3，深层标题用正文锚点 |
| 笔记间链接 404 / 死链 | 链接目标被删/改名/移动 | `npm run build` 报 broken link；删除笔记前先查引用（见 [笔记维护](./note-maintenance.md) 第七节） |

---

## 三、frontmatter 问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 文章不进归档/分类页 | `article: false` 或缺 `categories` | 普通文章确保 `article` 不设 false 且 `categories` 已填 |
| 分类归属错误 | `categories` 与目录结构不对应 | 两级分类对应一级/二级目录 |
| `date` 误改 | 把 date 当最后修改时间 | `date` 是创建日期不改；`lastUpdated` 依赖 git 提交时间自动生成 |

---

## 四、构建问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| `npm run dev` 失败 | `predev` 钩子的 `check.js` 拦截 | 看 `check.js` 报错，通常是环境/配置问题 |
| 内存溢出 | VuePress 大仓库 | 已配 `--max_old_space_size=4096`，仍溢出则分批构建 |
| 端口占用 | dev 默认端口冲突 | `npm run dev:win:port -- 8080` 指定端口 |
| `openssl-legacy-provider` 报错 | Node 17+ 与旧 webpack | 已在 dev/build 脚本配 `NODE_OPTIONS=--openssl-legacy-provider` |

---

## 五、Markdown 结构问题

| 问题 | 检测 | 修复 |
|------|------|------|
| 列表符号后缺空格（`-项目`） | `md:check` | `md:fix` 自动补 |
| 标题前后缺空行 | `md:check` | `md:fix` 自动补 |
| 连续空行过多（>2） | `md:check` | `md:fix` 压缩为 2 |
| 多个 H1 | `md:check` | 手动合并，保留一个 |
| 中英文/行内代码间距 | `kb:lint` | `kb:lint:fix` 自动补 |
| `**加粗**` 边界间距 | textlint 盲区 | 手动，见 [排版规范](./typography-rules.md) |

```bash
# 结构问题一键检查
cd utils/normalize && npm run md:check -- ../../docs/01.Java/10.基础.md
# 排版问题一键检查
cd utils/textlint && npm run kb:lint:one -- ../../docs/01.Java/10.基础.md
```

---

## 六、调试技巧

- **工具改动不覆盖原文件**：所有写操作产 `*_new.md`，确认无误后手动替换。`kb:lint:fix` 例外（直接覆盖），跑前确保 `git status` 干净。
- **`kb:all` 中间失败**：会残留 `*_working.md` 供调试；重跑从头开始（`prepareWorkingFile` 会先删旧 working 文件），不支持断点续传。
- **scan 报"找到 0 张图片"**：检查图目录命名是否为 `<篇名>.assets` 或 `images`，且图片在 asset 目录下（不在的图不被计入）。
