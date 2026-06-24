---
name: vdoing-knowledge-base
description: "本仓库 vuepress-theme-vdoing 知识库维护与规范入口：用于新增/整合/更新笔记、图片治理、导航维护、frontmatter 维护、发布前质检、Markdown 写作规范、VuePress / Vdoing 语法说明与常见问题排查。"
argument-hint: "描述你想做的事，例如：新增 Spring Security 6 笔记、整合 Redis 多份课程笔记、处理某篇文档的外链图片并转 webp、检查并修复笔记排版与结构、更新 config.ts 导航、删除过时笔记"
---

# VuePress Vdoing 知识库维护

本知识库基于 [vuepress-theme-vdoing](https://doc.xugaoyi.com/)，部署于 `docs/` 目录下，域名信息从 `docs/.vuepress/public/CNAME` 读取，主配置文件为 `docs/.vuepress/config.ts`。

本技能是知识库维护的**中心规范入口**，覆盖以下 10 大场景。各场景对应的工具命令集中见 [工具命令速查表](./references/scripts-cheatsheet.md)。

## 使用场景

1. **新增笔记**：新建某个技术主题的笔记文档
2. **整合笔记**：将一份或多份他人原始笔记整合为个人笔记（含外链图片本地化）
3. **更新笔记**：技术版本升级、补充遗漏、修正错误、单文件拆分
4. **图片治理**：外链下载、转 webp、查未使用、路径修复
5. **导航维护**：更新 `config.ts` 导航栏、新增目录页
6. **frontmatter 维护**：手改字段规范（title/date/permalink/categories/tags/author）
7. **发布前质量验收**：跑工具自动检查 + 人工复核
8. **常见问题排查**：图片不显示、侧边栏乱、404、路径问题
9. **写作规范与语法**：Markdown 内容规范、VuePress / Vdoing 容器与扩展语法
10. **Git 提交**：编写规范的 commit message

## 示例

**示例 1：新增笔记**

- 输入："新增一篇 Spring Security 6 的笔记，放在微服务生态/安全框架下"
- 处理：按路径规范创建 Markdown 文件；参照 [frontmatter 模板](./references/frontmatter-template.md) 填写 `title` / `date` / `permalink` / `categories` / `tags` / `author`；建议是否需要更新 `config.ts` 导航与目录页。

**示例 2：整合他人笔记**

- 输入："把这份 Redis 课程笔记整合进知识库，外链图片也要本地化"
- 处理：先读取原始资料，按 [笔记整合工作流](./references/note-synthesis.md) 去重去噪；涉及外链图片时转入第四节的图片处理流程；输出规范化后的 `*_new.md` 并提示人工替换。

**示例 3：图片处理**

- 输入："处理 docs/02.微服务核心/50.持久层框架/10.MyBatis.md 的外链图片并转 webp"
- 处理：执行 `cd utils/compress && npm run kb:all -- ../../docs/02.微服务核心/50.持久层框架/10.MyBatis.md`；输出最终 `*_new.md` 和扫描报告，并提示删除操作需人工确认。

**示例 4：发布前质量验收**

- 输入："检查这篇笔记是否可以发布"
- 处理：按第七节顺序执行自动检查与人工复核；最后按 [Git Commit Message 规范](./references/git-commit-guide.md) 建议提交信息。

## 输入与产出

### 输入建议

- 目标动作（新增 / 整合 / 更新 / 图片治理 / 导航维护 / 排版修复）
- 目标文件或目录（例如 `docs/03.微服务生态/10.安全框架/`）
- 是否需要保留原有 permalink（默认保留）
- 是否需要同步更新导航与目录页

### 标准产出

- 修改后的 Markdown 文档（结构化、去噪、可检索）
- 规范化 frontmatter（标题、时间、permalink、分类、标签、作者）
- 图片资源落盘到同级 `.assets/`，并优先 `.webp`
- 写作或语法问题时，明确引用对应参考文档与推荐写法
- 必要时同步更新 `docs/.vuepress/config.ts` 与目录页

---

## 一、新增笔记文档

### 1. 确定存放路径

```
docs/
  {序号}.{一级分类}/
    {序号}.{二级分类}/
      {序号}.{文章标题}.md
```

- 文件夹与文件名均以 **两位数字+英文点** 开头（如 `01.`、`10.`），数字控制侧边栏排序。
- 一级分类对应 `docs/00.目录页/` 中的目录页文件和 `config.ts` 中的 nav 条目。

### 2. 编写 frontmatter

见 [frontmatter 模板](./references/frontmatter-template.md)。

**普通文章 frontmatter 最小集：**

```yaml
---
title: {标题（中文，与 H1 一致）}
date: {YYYY-MM-DD HH:mm:ss}
permalink: /{kebab-case 路径}/
categories:
  - {一级分类中文名}
  - {二级分类中文名（可选）}
tags:
  - {标签1}
author:
  name: bombax
  link: https://github.com/coderofmutou
---
```

`permalink` 规则：小写英文 + 连字符，无中文，与 config.ts 中 nav 的 link 对齐。

### 3. 文章内容结构

```markdown
# {与 title 一致的 H1 标题}

## {一级章节}

### {二级章节}

> 重要提示、原文摘录用引用块

代码块注明语言（```java, ```xml, ```yaml 等）

图片统一存放在同级的 `{文档名}.assets/` 文件夹下，并转换为 `.webp` 格式。
```

### 4. 更新导航（config.ts）

若新增的是一个新的一级导航入口，见 [config.ts 导航维护指南](./references/config-guide.md)。

---

## 二、整合多份笔记为个人文档

将一份或多份他人原始笔记，提炼整合为个人风格的知识库文档。详细工作流见 [笔记整合工作流](./references/note-synthesis.md)。

### 快速原则

1. **去重优先**：多份资料重复概念，只保留一份最清晰的表述。
2. **去噪处理**：删除营销语言、课程广告、讲师介绍、无关截图。
3. **结构统一**：按「是什么 → 为什么 → 怎么用 → 注意事项」组织每个知识点。
4. **代码优先**：有代码示例的优先保留代码，删去纯文字复述。
5. **个人批注**：用 `> 💡 个人注：...` 引用格式标注疑问或补充。

### 图片处理（整合时高频）

他人笔记常含外链图片，**必须本地化**否则失效。整合过程中涉及图片时，转入第四节的图片处理流程；命令选择与分支判断见 [图片处理决策树](./references/image-pipeline.md)。

### 决策分支

- **资料冲突**：以官方文档/新版本语义为准；旧版本保留并标注版本边界。
- **示例代码重复**：保留最短可运行示例，复杂示例放折叠或拆子节。
- **图片过多**：保留必要流程图和结果图，删重复截图。
- **篇幅过长（>500 行）**：按主题拆分子文件，主文档加目录跳转。

---

## 三、更新已有笔记

覆盖场景：技术版本升级、补充遗漏、修正错误、单文件拆分。详细操作见 [已有笔记更新维护指南](./references/note-maintenance.md)。

**版本共存核心原则：**
- 旧版本仍有使用价值 → **新旧内容都保留**，明确标注版本范围，不替换
- 差异较小 → 同节内用 `> **X.x 差异**：` 引用块标注
- Breaking Change → 章节标题加版本括注，如 `## 安全配置（Spring Security 6.x）`
- 差异极大 → 文件级分离，文件名含版本信息
- `permalink` 一旦发布不要轻易修改（会造成死链）
- 单文件超过 500 行考虑按章节拆分

### 删除或归档笔记

删除已发布笔记是高风险操作（死链、导航残留）。删除、归档、`.assets/` 清理、导航移除与 permalink 取舍，见 [已有笔记更新维护指南](./references/note-maintenance.md) 第七节。

---

## 四、图片处理（外链/转 webp/查未用）

图片资产治理的决策树与命令映射见 [图片处理决策树](./references/image-pipeline.md)，命令速查见 [工具命令速查表](./references/scripts-cheatsheet.md)。

**核心命令：**

| 需求 | 命令 |
|------|------|
| 外链图片本地化 | `kb:download` |
| 批量转 webp | `kb:compress` |
| 查未使用图片（全仓库） | `kb:scan <docs根>` |
| 查未使用图片（单篇） | `kb:scan --local=<md>` |
| `<img>` 转 Markdown | `kb:convert` |
| 单篇全流程 | `kb:all` |

> ⚠️ **删除永远不自动**：`kb:scan` 只出报告，人工确认后再删。单篇模式会扫到同目录其他文档的 assets、且"未引用"可能被其他文章引用，删图务必用全仓库模式（见 [图片处理决策树](./references/image-pipeline.md)）。

---

## 五、config.ts 导航与目录页维护

导航、目录页与 `permalink` / `link` 对齐规则，见 [config.ts 导航维护指南](./references/config-guide.md)。

---

## 六、frontmatter 维护

单篇 frontmatter 直接手改即可。字段模板见 [frontmatter 模板](./references/frontmatter-template.md)；字段修改边界（`date` 不改、`permalink` 谨慎、`categories` / `tags` / `author` 可改）见 [已有笔记更新维护指南](./references/note-maintenance.md) 第六节。

> 批量统一字段时再使用 `npm run editFm`（`utils/editFrontmatter.js`）；单篇修改直接手改。

---

## 七、发布前质量验收（Quality Gate）

交付前逐项核对。**先跑工具自动检查，再人工复核**。

### 工具自动检查

```bash
# 1. 结构问题检查（列表/标题/空行/多H1/绝对路径图片）
cd utils/normalize && npm run md:check -- <md文件或目录>

# 2. 排版问题检查（中英文间距/行内代码间距）
cd utils/textlint && npm run kb:lint:one -- ../../<md文件>

# 3. 图片引用检查（未使用/绝对路径/外链残留）
cd utils/compress && npm run kb:scan -- --local=<md文件>
```

### 人工复核

- [ ] 标题与 `frontmatter.title` 一致，且只有一个 H1
- [ ] `permalink` 唯一、稳定、无中文路径
- [ ] 分类与标签可反映主题（如 Java、Spring、MyBatis、Redis）
- [ ] 代码块均带语言标识（`java`、`xml`、`yaml`、`bash` 等）
- [ ] 图片链接均可访问，优先本地化且路径使用相对引用
- [ ] `**加粗**` / `*斜体*` 边界与中文间有空格（textlint 盲区，见 [排版规范](./references/typography-rules.md)）
- [ ] 中文语境用全角标点，代码/命令用半角（textlint 盲区）
- [ ] 涉及新增栏目时，`config.ts` 与目录页已同步
- [ ] 文档无明显广告噪声、重复段落

### 全仓库体检（发布前 / 定期）

上面是单篇质检。发布前或定期维护时，对整个 `docs/` 做一次体检：

```bash
# 1. 结构问题
(cd utils/normalize && npm run md:check -- ../../docs)

# 2. 排版问题
(cd utils/textlint && npm run kb:lint)

# 3. 图片引用
(cd utils/compress && npm run kb:scan -- ../../docs)

# 4. 构建兜底检查（仓库根执行）
npm run build
```

> 前三条用于快速体检；`npm run build` 作为最终兜底，会暴露 broken link、permalink 冲突和 frontmatter 错误。

---

## 八、写作规范与 VuePress / Vdoing 语法

本节用于汇总“内容怎么写、语法怎么用”的相关规范。

### 快速导航

| 你要解决的问题 | 优先查看 |
|------|------|
| 内容组织、标题命名、引用来源、示例取舍 | [Markdown 写作规范](./references/markdown-writing-guide.md) |
| 中英文空格、全半角、加粗边界、行内代码空格 | [排版规范](./references/typography-rules.md) |
| `:::tip` / `:::note` / `cardList` / `[[toc]]` / 高亮行 | [VuePress / Vdoing 语法与内容增强指南](./references/vuepress-vdoing-syntax-guide.md) |

`frontmatter` 与导航维护分别见第六节、第五节。

### 一个实用原则

知识库写作建议按以下优先级选择：

1. 普通 Markdown 结构
2. VuePress 原生扩展
3. Vdoing 增强容器
4. 自定义 HTML

越往后表现力越强，但维护成本也越高。

---

## 九、常见问题排查

| 问题 | 解决方案 |
|------|----------|
| 图片不显示（中文路径） | 项目已启用 `markdown-it-disable-url-encode`；优先检查相对路径、文件名空格/特殊字符、大小写是否一致 |
| 图片不显示（绝对路径） | `kb:scan` 定位，手动改相对路径 |
| 图片不显示（外链失效） | `kb:download` 本地化 |
| 侧边栏顺序乱 | 文件名以 `{两位数}.` 开头 |
| 目录页空白 | `pageComponent.data.path` 与文件夹名完全一致 |
| 新文章不在导航 | `config.ts` nav 未更新，见 [config.ts 导航维护指南](./references/config-guide.md) |
| permalink 冲突 | 全局唯一，发布后不轻易改 |
| 构建失败 | 看 `predev`/`prebuild` 钩子 `check.js` 报错 |

完整排查表见 [常见问题排查](./references/troubleshooting.md)。

---

## 十、Git 提交规范

每次操作完成后，按 [Git Commit Message 规范](./references/git-commit-guide.md) 编写提交信息。

**格式**：`[类型] {操作动词} {操作对象}[，{补充说明}]`

| 操作 | commit 示例 |
|------|------------|
| 新增笔记 | `[笔记] 新增 Spring Security 笔记` |
| 新增系列章节 | `[笔记] 新增 JavaWeb 技术笔记（第07章_Servlet）` |
| 整合他人笔记 | `[笔记] 新增 Redis 笔记，整合自尚硅谷教程` |
| 图片本地化+转webp | `[图片] 优化 MyBatis 笔记图片，本地化外链并转换为 webp` |
| 更新已有笔记 | `[笔记] 更新 MyBatis 笔记，补充动态 SQL 章节` |
| 更新导航菜单 | `[配置] 更新导航菜单，新增 Redis 子项` |
| 更新技能文件 | `[技能] 更新知识库维护技能，合并为单一入口` |

> 单次提交只做一件事，多件事分多次提交。系列笔记禁止多次用完全相同的 message，必须区分章节范围。

---

## 附录：维护范围自检表

每次更新本技能时，确认仍覆盖以下能力：

- [ ] 新增一篇笔记（普通/目录页/随笔/@pages）
- [ ] 整合多份课程资料
- [ ] 更新/拆分/版本共存已有笔记
- [ ] 删除/归档已发布笔记（死链预防 + permalink 取舍）
- [ ] frontmatter、导航与目录页维护
- [ ] 图片处理（外链下载/转 webp/查未用/路径修复）
- [ ] Markdown 写作规范、排版规范、VuePress / Vdoing 语法说明
- [ ] Markdown 结构归一化与中英文混排排版检查
- [ ] 发布前质量验收（工具自动 + 人工复核）
- [ ] 链接/路径/404/图片不显示排查
- [ ] Git 提交规范

## references 索引

| 文件 | 内容 |
|------|------|
| [frontmatter-template.md](./references/frontmatter-template.md) | 普通/目录页/随笔/@pages frontmatter 模板 |
| [config-guide.md](./references/config-guide.md) | config.ts nav 维护 + sidebar 自动规则 |
| [note-synthesis.md](./references/note-synthesis.md) | 整合多份资料的工作流 |
| [note-maintenance.md](./references/note-maintenance.md) | 更新、版本共存、拆分、删除/归档 |
| [image-pipeline.md](./references/image-pipeline.md) | 图片处理决策树 + 命令映射 |
| [scripts-cheatsheet.md](./references/scripts-cheatsheet.md) | 全部工具命令速查表 |
| [markdown-writing-guide.md](./references/markdown-writing-guide.md) | Markdown 内容写作规范 |
| [typography-rules.md](./references/typography-rules.md) | 中英文混排排版规范 |
| [vuepress-vdoing-syntax-guide.md](./references/vuepress-vdoing-syntax-guide.md) | VuePress / Vdoing 容器与增强语法 |
| [troubleshooting.md](./references/troubleshooting.md) | 常见问题排查 |
| [git-commit-guide.md](./references/git-commit-guide.md) | Git commit message 规范 |