# 知识库维护规范参考手册

> 本文件是规范参考文档，供执行流程中按需查阅。日常使用请通过 SKILL.md 的流程入口触发。

本知识库基于 [vuepress-theme-vdoing](https://doc.xugaoyi.com/)，部署于 `docs/` 目录下，主配置文件为 `docs/.vuepress/config.ts`。

---

## 一、新增笔记文档

### 目录结构规范

```
docs/
  {序号}.{一级分类}/
    {序号}.{二级分类}/
      {序号}.{文章标题}.md
```

- 文件夹与文件名均以 **两位数字+英文点** 开头（如 `01.`、`10.`），数字控制侧边栏排序。
- 一级分类对应 `docs/00.目录页/` 中的目录页文件和 `config.ts` 中的 nav 条目。

### frontmatter

见 [frontmatter 模板](./frontmatter-template.md)。`permalink` 规则：小写英文 + 连字符，无中文，与 config.ts 中 nav 的 link 对齐。

### 文章内容结构

```markdown
# {与 title 一致的 H1 标题}

## {一级章节}

### {二级章节}

> 重要提示、原文摘录用引用块

代码块注明语言（```java, ```xml, ```yaml 等）

图片统一存放在同级的 `{文档名}.assets/` 文件夹下，并转换为 `.webp` 格式。
```

### 更新导航（config.ts）

若新增的是一个新的一级导航入口，见 [config.ts 导航维护指南](./config-guide.md)。

---

## 二、整合多份笔记为个人文档

详细工作流见 [笔记整合工作流](./note-synthesis.md)。

### 快速原则

1. **去重优先**：多份资料重复概念，只保留一份最清晰的表述。
2. **去噪处理**：删除营销语言、课程广告、讲师介绍、无关截图。
3. **结构统一**：按「是什么 → 为什么 → 怎么用 → 注意事项」组织每个知识点。
4. **代码优先**：有代码示例的优先保留代码，删去纯文字复述。
5. **个人批注**：用 `> 💡 个人注：...` 引用格式标注疑问或补充。

### 决策分支

- **资料冲突**：以官方文档/新版本语义为准；旧版本保留并标注版本边界。
- **示例代码重复**：保留最短可运行示例，复杂示例放折叠或拆子节。
- **图片过多**：保留必要流程图和结果图，删重复截图。
- **单个文件跨越了多个可独立检索的主题**：按主题拆分子文件，主文档加目录跳转。

---

## 三、更新已有笔记

覆盖场景：技术版本升级、补充遗漏、修正错误、单文件拆分。详细操作见 [已有笔记更新维护指南](./note-maintenance.md)。

**版本共存核心原则：**
- 旧版本仍有使用价值 → **新旧内容都保留**，明确标注版本范围，不替换
- 差异较小 → 同节内用 `> **X.x 差异**：` 引用块标注
- Breaking Change → 章节标题加版本括注，如 `## 安全配置（Spring Security 6.x）`
- 差异极大 → 文件级分离，文件名含版本信息
- `permalink` 一旦发布不要轻易修改（会造成死链）

### 删除或归档笔记

删除已发布笔记是高风险操作（死链、导航残留）。详见 [已有笔记更新维护指南](./note-maintenance.md) 第七节。

---

## 四、图片处理

图片资产治理的决策树与命令映射见 [图片处理决策树](./image-pipeline.md)，命令速查见 [工具命令速查表](./scripts-cheatsheet.md)。

| 需求 | 命令 |
|------|------|
| 外链图片本地化 | `kb:download` |
| 批量转 webp | `kb:compress` |
| 查未使用图片（全仓库） | `kb:scan <docs根>` |
| 查未使用图片（单篇） | `kb:scan --local=<md>` |
| `<img>` 转 Markdown | `kb:convert` |
| 单篇全流程 | `kb:all` |

> ⚠️ **删除永远不自动**：`kb:scan` 只出报告，人工确认后再删。删图务必用全仓库模式。

---

## 五、config.ts 导航与目录页维护

导航、目录页与 `permalink` / `link` 对齐规则，见 [config.ts 导航维护指南](./config-guide.md)。

---

## 六、frontmatter 维护

字段模板见 [frontmatter 模板](./frontmatter-template.md)；字段修改边界（`date` 不改、`permalink` 谨慎）见 [已有笔记更新维护指南](./note-maintenance.md) 第六节。

> `npm run editFm` 需配合手动建立 `utils/config.yml` 才能运行，单篇直接手改即可。

---

## 七、发布前质量验收

### 单篇工具自动检查

```bash
# 1. 结构问题（列表/标题/空行/多H1/绝对路径图片）
(cd utils/normalize && npm run md:check -- ../../<md文件或目录>)

# 2. 排版问题（中英文间距/行内代码间距）
(cd utils/textlint && npm run kb:lint:one -- ../../<md文件>)

# 3. 图片引用（未使用/绝对路径/外链残留）
(cd utils/compress && npm run kb:scan -- --local=../../<md文件>)
```

### 人工复核清单

- [ ] 标题与 `frontmatter.title` 一致，且只有一个 H1
- [ ] `permalink` 唯一、稳定、无中文路径
- [ ] 分类与标签可反映主题（如 Java、Spring、MyBatis、Redis）
- [ ] 代码块均带语言标识（`java`、`xml`、`yaml`、`bash` 等）
- [ ] 图片链接均可访问，优先本地化且路径使用相对引用
- [ ] `**加粗**` / `*斜体*` 边界与中文间有空格（textlint 盲区）
- [ ] 中文语境用全角标点，代码/命令用半角（textlint 盲区）
- [ ] 涉及新增栏目时，`config.ts` 与目录页已同步
- [ ] 文档无明显广告噪声、重复段落

### 全仓库体检（发布前 / 定期）

```bash
# 1. 结构问题
(cd utils/normalize && npm run md:check -- ../../docs)
# 2. 排版问题
(cd utils/textlint && npm run kb:lint)
# 3. 图片引用
(cd utils/compress && npm run kb:scan -- ../../docs)
# 4. 构建兜底（仓库根执行）
npm run build
```

---

## 八、写作规范与语法

| 你要解决的问题 | 优先查看 |
|------|------|
| 内容组织、标题命名、引用来源、示例取舍 | [Markdown 写作规范](./markdown-writing-guide.md) |
| 中英文空格、全半角、加粗边界、行内代码空格 | [排版规范](./typography-rules.md) |
| `:::tip` / `:::note` / `cardList` / `[[toc]]` / 高亮行 | [VuePress / Vdoing 语法与内容增强指南](./vuepress-vdoing-syntax-guide.md) |

---

## 九、常见问题排查

| 问题 | 解决方案 |
|------|----------|
| 图片不显示（中文路径） | 优先检查相对路径、文件名空格/特殊字符、大小写 |
| 图片不显示（绝对路径） | `kb:scan` 定位，手动改相对路径 |
| 图片不显示（外链失效） | `kb:download` 本地化 |
| 侧边栏顺序乱 | 文件名以 `{两位数}.` 开头 |
| 目录页空白 | `pageComponent.data.path` 与文件夹名完全一致 |
| 新文章不在导航 | `config.ts` nav 未更新，见 [config.ts 导航维护指南](./config-guide.md) |
| permalink 冲突 | 全局唯一，发布后不轻易改 |
| 构建失败 | 看 `predev`/`prebuild` 钩子 `check.js` 报错 |

完整排查表见 [常见问题排查](./troubleshooting.md)。

---

## 十、Git 提交规范

**格式**：`[类型] {操作动词} {操作对象}[，{补充说明}]`

| 操作 | commit 示例 |
|------|------------|
| 新增笔记 | `[笔记] 新增 Spring Security 笔记` |
| 整合他人笔记 | `[笔记] 新增 Redis 笔记，整合自尚硅谷教程` |
| 图片本地化+转webp | `[图片] 优化 MyBatis 笔记图片，本地化外链并转换为 webp` |
| 更新已有笔记 | `[笔记] 更新 MyBatis 笔记，补充动态 SQL 章节` |
| 更新导航菜单 | `[配置] 更新导航菜单，新增 Redis 子项` |

> 单次提交只做一件事，多件事分多次提交。

详细规范见 [Git Commit Message 规范](./git-commit-guide.md)。
