---
name: kb-maintenance
description: "本仓库 vuepress-theme-vdoing 知识库维护执行入口。触发后自动判断任务类型，生成 TodoList 并逐步执行所有能自动化的步骤。新增笔记、整合他人资料、优化/更新已有文档、图片治理、导航维护、全仓库体检、删除或归档笔记——凡涉及 docs/ 下任意 Markdown 文档的创建、修改、图片、frontmatter、导航、质检、提交，都应触发本技能。"
argument-hint: "描述你想做的事和目标文件/目录，例如：优化 docs/02.微服务核心/50.持久层框架/10.MyBatis.md、整合这份 Redis 课程笔记、新增 Spring Security 6 笔记放在微服务生态/安全框架下、帮我做全仓库体检"
---

# VuePress Vdoing 知识库维护

本技能是知识库维护的**执行入口**。触发后先判断任务类型，再生成裁剪过的 TodoList，然后把所有能自动执行的步骤都做掉，人工步骤明确标出让用户确认。

规范细节统一放在 `references/` 下按需 Read，不在本文件重复。

---

## 第一步：判断任务类型

根据用户描述，将任务归入以下三类之一：

### A 类：内容写作（走完整流程）

涵盖：新增笔记、整合他人资料、优化/更新/重构已有文档、修正内容错误

**执行完整 6 步流程**（见下方"A 类完整流程"）。

### B 类：单项维护（只走对应步骤 + commit）

涵盖：只处理图片、只改导航/目录页、只修 frontmatter、只跑排版修复、删除或归档笔记

**只执行对应步骤**，然后直接跳到 commit。

| 任务 | 执行步骤 |
|------|---------|
| 图片治理 | Step 2（图片）→ Step 6（commit） |
| 导航/目录页 | Step 4（导航）→ Step 6（commit） |
| frontmatter | Step 3（frontmatter）→ Step 6（commit） |
| 排版/结构修复 | Step 5 工具检查修复 → Step 6（commit） |
| 删除/归档笔记 | 读 [note-maintenance.md](./references/note-maintenance.md) 第七节，按步骤执行 → Step 6 |

### C 类：全仓库体检

用户说"体检"、"发布前检查"、"全量扫描"等。

**执行全仓库体检命令组**（见下方"C 类全仓库体检"）。

---

## A 类完整流程

生成如下 TodoList 并逐步执行。**能自动执行的步骤直接执行，不要反复询问用户是否要做**；只有真正需要人工判断的地方才暂停确认。

```
[ ] Step 1. 内容写作
[ ] Step 2. 图片治理
[ ] Step 3. frontmatter 核查
[ ] Step 4. 导航与目录页
[ ] Step 5. 发布前质检
[ ] Step 6. Git commit
```

### Step 1. 内容写作

根据子类型选择，**开始前先读对应的 reference 文件**：

- **新增笔记**：读 [maintenance-guide.md](./references/maintenance-guide.md) 第一节了解目录结构规范，再按路径规范创建文件，H1 与 title 一致，内容从 H2 起
- **整合他人资料**：读 [note-synthesis.md](./references/note-synthesis.md) 了解完整工作流，去重去噪，按「是什么→为什么→怎么用→注意事项」重组
- **优化已有文档**：读 [note-maintenance.md](./references/note-maintenance.md) 了解版本共存原则与拆分时机；同时按 [markdown-writing-guide.md](./references/markdown-writing-guide.md) 第十一节"内容优化检查项"执行自动修复并标记需人工确认的问题

写作过程中按需参考：
- 内容组织、标题命名、示例取舍 → 读 [markdown-writing-guide.md](./references/markdown-writing-guide.md)
- 中英文空格、加粗边界、行内代码空格等排版细节 → 读 [typography-rules.md](./references/typography-rules.md)
- `:::tip` / `:::note` / `cardList` / `[[toc]]` 等 VuePress / Vdoing 专属语法 → 读 [vuepress-vdoing-syntax-guide.md](./references/vuepress-vdoing-syntax-guide.md)

### Step 2. 图片治理

先读 [image-pipeline.md](./references/image-pipeline.md) 了解决策树，再对目标文件执行单篇全流程（自动化）：

```bash
(cd utils/compress && npm run kb:all -- ../../<目标md文件>)
```

`kb:all` 串行执行 download → convert → compress → scan --local。产出 `*_new.md`，不覆盖原文件。命令参数详见 [scripts-cheatsheet.md](./references/scripts-cheatsheet.md)。

**如果有 `*_new.md` 产出**：展示变更摘要，询问用户确认后替换原文件。

**scan 报告处理**：
- 「全仓库未引用」类的图片**不要自动删除**，列出报告让用户人工确认
- 外链下载失败的图片，记录在摘要里

**遇到报错**：先查 [troubleshooting.md](./references/troubleshooting.md) 一节图片相关问题。

### Step 3. frontmatter 核查

读 [frontmatter-template.md](./references/frontmatter-template.md) 对照模板，核查并修正目标文件的 frontmatter。字段修改边界规则见 [note-maintenance.md](./references/note-maintenance.md) 第六节。

**自动执行**：
- 补全缺失的必填字段（title / date / permalink / categories / tags / author）
- 检查 permalink 是否符合规范（小写英文+连字符，无中文）

**人工确认**：
- `permalink` 若已发布且需要变更，提示用户确认（变更 = 死链风险）
- `date` 字段**不修改**（代表创建日期）

### Step 4. 导航与目录页

**只在以下情况执行**，否则跳过此步：
- 新增了一个新的一级或二级导航分类
- 用户明确要求更新导航

读 [config-guide.md](./references/config-guide.md) 了解 nav 配置规则与 permalink / link 对齐规范，再检查 `docs/.vuepress/config.ts` 的 nav 配置与 `docs/00.目录页/` 是否需要同步更新。

`sidebar: 'structuring'` 自动生成，增删文件后侧边栏自动更新，无需手动改。

### Step 5. 发布前质检

对目标文件依次执行以下工具检查（自动执行，发现问题自动修复可修复项）。命令参数详见 [scripts-cheatsheet.md](./references/scripts-cheatsheet.md)：

```bash
# 结构问题（列表空格/标题空行/连续空行/多H1）→ 有问题时产 *_new.md
(cd utils/normalize && npm run md:check -- ../../<目标文件或目录>)

# 排版问题（中英文间距/行内代码间距）
(cd utils/textlint && npm run kb:lint:one -- ../../<目标md文件>)
```

如果 `md:check` 发现可修复问题，继续执行：
```bash
(cd utils/normalize && npm run md:fix -- ../../<目标文件或目录>)
```

**遇到报错**：先查 [troubleshooting.md](./references/troubleshooting.md) 五节 Markdown 结构问题与六节调试技巧。

**人工复核清单**（工具检查后，让用户确认以下几项）：

- [ ] 标题与 `frontmatter.title` 一致，且只有一个 H1
- [ ] `permalink` 唯一、稳定、无中文路径
- [ ] 分类与标签可反映主题
- [ ] 代码块均带语言标识（`java`、`xml`、`yaml`、`bash` 等；优化已有文档时已自动补全，此处二次确认）
- [ ] 图片链接均可访问，路径使用相对引用
- [ ] `**加粗**` / `*斜体*` 边界与中文间有空格（textlint 盲区，需人工；规则见 [typography-rules.md](./references/typography-rules.md)）
- [ ] 中文语境用全角标点，代码/命令用半角（textlint 盲区）
- [ ] 文档无明显广告噪声、重复段落

### Step 6. Git commit

读 [git-commit-guide.md](./references/git-commit-guide.md) 了解完整规范，按格式建议 commit message：`[类型] {操作动词} {操作对象}[，{补充说明}]`

| 操作 | commit 示例 |
|------|------------|
| 新增笔记 | `[笔记] 新增 Spring Security 笔记` |
| 整合他人笔记 | `[笔记] 新增 Redis 笔记，整合自尚硅谷教程` |
| 优化已有文档 | `[笔记] 优化 MyBatis 笔记，重构动态 SQL 章节` |
| 图片本地化+转webp | `[图片] 优化 MyBatis 笔记图片，本地化外链并转换为 webp` |
| 更新导航菜单 | `[配置] 更新导航菜单，新增 Redis 子项` |

## B 类删除/归档笔记

读 [note-maintenance.md](./references/note-maintenance.md) 第七节，按步骤执行（查死链 → 处理图片资产 → 移除导航 → permalink 取舍），再执行 Step 6 commit。

删除是破坏性操作，每步执行前向用户确认。

---

## C 类全仓库体检

```bash
# 1. 结构问题（列表/标题/空行/多H1/绝对路径图片，全仓库）
(cd utils/normalize && npm run md:check -- ../../docs)

# 2. 排版问题（中英文间距，全仓库）
(cd utils/textlint && npm run kb:lint)

# 3. 图片引用（未使用/绝对路径/外链残留，全仓库反向索引）
(cd utils/compress && npm run kb:scan -- ../../docs)

# 4. 死链/permalink 冲突/构造错误（仓库根执行，最终兜底）
npm run build
```

逐条执行，汇总发现的问题，按严重程度排序后呈现给用户。不自动修复，由用户决定哪些需要处理。命令参数详见 [scripts-cheatsheet.md](./references/scripts-cheatsheet.md)。

---

## 常见问题快速排查

遇到问题先查 [troubleshooting.md](./references/troubleshooting.md)，涵盖图片、导航结构、frontmatter、构建、Markdown 结构、调试技巧六大类。

| 问题 | 解决方案 |
|------|----------|
| 图片不显示（绝对路径） | `kb:scan` 定位，手动改相对路径 |
| 图片不显示（外链失效） | `kb:download` 本地化 |
| 侧边栏顺序乱 | 文件名以 `{两位数}.` 开头 |
| 目录页空白 | `pageComponent.data.path` 与文件夹名完全一致 |
| 新文章不在导航 | `config.ts` nav 未更新 |
| permalink 冲突 | 全局唯一，发布后不轻易改 |

---

## references 一览

各文件的 Read 时机已在上方流程步骤中标注。此处仅列出各文件内容摘要：

| 文件 | 内容 |
|------|------|
| [maintenance-guide.md](./references/maintenance-guide.md) | 目录结构、版本共存、删除流程等规范细节 |
| [frontmatter-template.md](./references/frontmatter-template.md) | 普通/目录页/随笔/@pages frontmatter 模板 |
| [config-guide.md](./references/config-guide.md) | config.ts nav 维护 + sidebar 自动规则 |
| [note-synthesis.md](./references/note-synthesis.md) | 整合多份资料的完整工作流 |
| [note-maintenance.md](./references/note-maintenance.md) | 更新、版本共存、拆分、删除/归档 |
| [image-pipeline.md](./references/image-pipeline.md) | 图片处理决策树 + 命令映射 |
| [scripts-cheatsheet.md](./references/scripts-cheatsheet.md) | 全部工具命令速查表（含参数示例） |
| [markdown-writing-guide.md](./references/markdown-writing-guide.md) | Markdown 内容写作规范 |
| [typography-rules.md](./references/typography-rules.md) | 中英文混排排版规范（含 textlint 盲区） |
| [vuepress-vdoing-syntax-guide.md](./references/vuepress-vdoing-syntax-guide.md) | VuePress / Vdoing 容器与增强语法 |
| [troubleshooting.md](./references/troubleshooting.md) | 常见问题排查（图片/导航/frontmatter/构建） |
| [git-commit-guide.md](./references/git-commit-guide.md) | Git commit message 规范 |
