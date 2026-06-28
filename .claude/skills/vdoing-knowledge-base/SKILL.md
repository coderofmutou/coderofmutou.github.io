---
name: kb-maintenance
description: "本仓库 vuepress-theme-vdoing 知识库维护执行入口。触发后自动判断任务类型，生成 TodoList 并逐步执行所有能自动化的步骤。新增笔记、整合他人资料、优化/更新已有文档、图片治理、导航维护、全仓库体检、删除或归档笔记——凡涉及 docs/ 下任意 Markdown 文档的创建、修改、图片、frontmatter、导航、质检、提交，都应触发本技能。"
argument-hint: "描述你想做的事和目标文件/目录，例如：优化 docs/02.微服务核心/50.持久层框架/10.MyBatis.md、整合这份 Redis 课程笔记、新增 Spring Security 6 笔记放在微服务生态/安全框架下、帮我做全仓库体检"
---

# VuePress Vdoing 知识库维护

本技能是知识库维护的**执行入口**。触发后先判断任务类型，再生成裁剪过的 TodoList，然后把所有能自动执行的步骤都做掉，人工步骤明确标出让用户确认。

规范细节统一放在 `references/` 下按需 Read，不在本文件重复。

**路径输出规范**：路径引用使用相对路径或 `<项目根>/…`，不显示含用户名的绝对路径。

---

## 第一步：判断任务类型

根据用户描述，将任务归入以下三类之一：

### A 类：内容写作（走完整流程）

涵盖：新增笔记、整合他人资料、优化/更新/重构已有文档、修正内容错误

**执行完整 6 步流程**（见下方"A 类完整流程"）。

### B 类：单项维护（只走对应步骤 + 生成 commit 建议）

涵盖：只处理图片、只改导航/目录页、只修 frontmatter、只跑排版修复、删除或归档笔记

**只执行对应步骤**，然后进入 Step 6 生成建议 commit message，由用户确认后手动提交或授权提交。

| 任务 | 执行步骤 |
|------|---------|
| 图片治理 | Step 2（图片）→ Step 6（生成 commit 建议） |
| 导航/目录页 | Step 4（导航）→ Step 6（生成 commit 建议） |
| frontmatter | Step 3（frontmatter）→ Step 6（生成 commit 建议） |
| 排版/结构修复 | Step 5 工具检查修复 → Step 6（生成 commit 建议） |
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
[ ] Step 6. 生成建议 commit message
```

### Step 1. 内容写作

根据子类型选择，**开始前先读对应的 reference 文件**：

- **新增笔记**：读 [maintenance-guide.md](./references/maintenance-guide.md) 第一节了解目录结构规范，再按路径规范创建文件，H1 与 title 一致，内容从 H2 起
- **整合他人资料**：读 [note-synthesis.md](./references/note-synthesis.md) 了解完整工作流，去重去噪，按「是什么→为什么→怎么用→注意事项」重组
- **优化已有文档**：读 [note-maintenance.md](./references/note-maintenance.md) 了解版本共存原则与拆分时机；同时按 [markdown-writing-guide.md](./references/markdown-writing-guide.md) 第十节"内容优化检查项"执行（含输出规范：过程中只输出进度标记，全部完成后统一输出改动摘要与候选项清单）。

写作过程中按需参考：
- 内容组织、标题命名、示例取舍、个人注写法 → 读 [markdown-writing-guide.md](./references/markdown-writing-guide.md)
- 中英文空格、加粗边界、行内代码空格等排版细节 → 读 [typography-rules.md](./references/typography-rules.md)
- `:::tip` / `:::note` / `:::warning` / `cardList` / `[[toc]]` 等 VuePress / Vdoing 专属语法 → 读 [vuepress-vdoing-syntax-guide.md](./references/vuepress-vdoing-syntax-guide.md)

**提示性 / 补充性 / 个人理解类内容优先使用 Vdoing 容器**：
- 最佳实践、技巧、经验 → `::: tip`
- 普通知识补充、个人总结 → `::: note`（可在标题中写 `::: note 💡 个人注`）
- 注意事项、易错点、前提约束 → `::: warning`
- 高风险、不可逆操作 → `::: danger`
- 普通 `>` 引用块仅用于引用第三方来源或参考资料，不用于个人注/提示。

> ✅ Step 1 完成后立即输出：`✅ Step 1 完成 — {一句话说明范围（N 个文件 / 单文件名称）}`，随后依次输出 ① **改动摘要**（各文件执行了哪些修改，单文件直接列出）；② **候选项清单**（按类型分组，标注所在文件与位置），供用户统一决策

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

> ✅ Step 2 完成后立即输出：`✅ Step 2 完成 — {一句话说明图片处理结果}`

### Step 3. frontmatter 核查

读 [frontmatter-template.md](./references/frontmatter-template.md) 对照模板，核查并修正目标文件的 frontmatter。字段修改边界规则见 [note-maintenance.md](./references/note-maintenance.md) 第六节。

**修改原则**：使用 Edit 工具**外科手术式**修改——只补全缺失字段、只修正有问题的字段值，**不重写整个 frontmatter 块**，不重排已有字段的顺序。

**自动执行**：
- 补全缺失的必填字段（title / date / permalink / categories / author），追加到已有字段末尾，不调整原有字段顺序
- 检查 permalink 是否符合规范（小写英文+连字符，无中文）
- `tags` 字段：**必填，固定写成 `tags:\n  - `（留空）**，位于 `categories` 与 `author` 之间；若原文件已有值则保留，若无或格式不对则补全

**人工确认**：
- `permalink` 若已发布且需要变更，提示用户确认（变更 = 死链风险）
- `date` 字段**不修改**（代表创建日期）

> ✅ Step 3 完成后立即输出：`✅ Step 3 完成 — {一句话说明 frontmatter 修改情况}`

### Step 4. 导航与目录页

**只在以下情况执行**，否则跳过此步：
- 新增了一个新的一级或二级导航分类
- 用户明确要求更新导航

读 [config-guide.md](./references/config-guide.md) 了解 nav 配置规则与 permalink / link 对齐规范，再检查 `docs/.vuepress/config.ts` 的 nav 配置与 `docs/00.目录页/` 是否需要同步更新。

`sidebar: 'structuring'` 自动生成，增删文件后侧边栏自动更新，无需手动改。

> ✅ Step 4 执行完成（或确认跳过）后立即输出：`✅ Step 4 完成 — {有改动则说明改了什么，否则"导航无需更新，已跳过"}`

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

工具检查完成后，执行以下补充核查：

**自动核查**（无异常则静默，有问题直接修复或报告）：
- H1 唯一性 + 与 `frontmatter.title` 一致：读文件对比，不一致时列出差异
- `permalink` 格式（无中文、小写英文+连字符）：正则扫描，有问题直接报告
- `permalink` 唯一性：grep 全库，有冲突则报告
- 代码块语言标识：扫描 ` ``` ` 后无标识符的行并补全（若 Step 1 已处理则跳过）
- 图片使用相对路径：md:check 已覆盖，此处确认无遗漏

**扫描并列出候选**（无异常则静默，有问题只列出问题项供用户确认后处理）：
- **图片可访问性**：检查文档中所有本地图片引用，验证文件是否存在，列出缺失项
- **加粗/斜体边界间距**：列出 `**中文**中文`、`中文**中文**` 等边界缺空格的行（textlint 盲区；规则见 [typography-rules.md](./references/typography-rules.md)）
- **中文全角/半角标点**：列出中文段落中疑似误用半角 `,` `.` `:` `()` `!` `?` 的行，排除代码块内容（textlint 盲区）
- **分类与标签准确性**：读 frontmatter，结合文档主题表态（"看起来合理" 或 "感觉有些偏，建议调整为 XX"），由用户确认

> ✅ Step 5 完成后立即输出：`✅ Step 5 完成 — {一句话说明质检结果或发现的问题}`

### Step 6. 生成建议 commit message

读 [git-commit-guide.md](./references/git-commit-guide.md) 了解格式规范，**仅生成一条简短（≤50 字）的 commit message 建议，不自动执行 `git commit`**。

格式要求：
```
[类型] {操作动词} {操作对象}[，{补充说明}]
```

- **首行必须单行**，控制在 50 字以内。
- **body 可选**：改动范围较广时可附 2–3 条 bullet，每条一句归纳即止，不展开细节。
- 只输出 message 纯文本（不要包裹 `git commit -m "..."` 命令）。
- 将建议 message 和涉及文件清单一起展示给用户，由用户确认后手动提交，或授权你执行提交。
- 若 Step 1 仍有未处理的候选项，在 commit message body 末尾补注：`（另有 N 项内容优化候选待处理，见 Step 1 清单）`

| 操作 | commit 示例 |
|------|------------|
| 新增笔记 | `[笔记] 新增 Spring Security 笔记` |
| 整合他人笔记 | `[笔记] 新增 Redis 笔记，整合自尚硅谷教程` |
| 优化已有文档 | `[笔记] 优化 MyBatis 笔记，重构动态 SQL 章节` |
| 图片本地化+转webp | `[图片] 优化 MyBatis 笔记图片，本地化外链并转换为 webp` |
| 更新导航菜单 | `[配置] 更新导航菜单，新增 Redis 子项` |

> ✅ Step 6 完成后立即输出：`✅ Step 6 完成 — 建议 commit message 已生成`

## B 类删除/归档笔记

读 [note-maintenance.md](./references/note-maintenance.md) 第七节，按步骤执行（查死链 → 处理图片资产 → 移除导航 → permalink 取舍），再进入 Step 6 生成 commit 建议。

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
