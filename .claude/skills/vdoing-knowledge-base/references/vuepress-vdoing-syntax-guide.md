# VuePress / Vdoing 语法与内容增强指南

适用范围：`docs/` 下所有由 VuePress 1.x 渲染的 Markdown 页面。

---

## 一、先分清两层能力

### 1. VuePress 原生 Markdown 扩展

当前仓库基于 **VuePress 1.x**，原生常用能力包括：

- YAML frontmatter
- 内部链接与相对链接
- 表格
- Emoji
- `[[toc]]`
- 自定义容器（默认主题容器）
- 代码高亮
- 代码高亮行

### 2. Vdoing 主题增强能力

在 VuePress 原生能力之外，`vuepress-theme-vdoing` 又补充了：

- `note` 笔记容器
- `center` / `right` / `theorem` 等布局或展示容器
- `cardList` / `cardImgList` 卡片容器
- 目录页、结构化侧边栏、自动 frontmatter 扩展等主题能力

**结论**：写笔记时，先判断是“标准 Markdown / VuePress 语法”，还是
“Vdoing 专属增强”，不要混为一谈。

---

## 二、最常用的信息类容器

### 1. VuePress 默认容器

VuePress 默认支持以下容器：

- `tip`
- `warning`
- `danger`
- `details`

示例：

```markdown
::: tip
这是一个提示。
:::

::: warning
这是一个注意事项。
:::

::: danger
这是一个高风险警告。
:::

::: details 点击展开
这里放补充说明或长代码。
:::
```

### 2. Vdoing 新增的 `note` 容器

Vdoing 额外支持：

```markdown
::: note
这是一个笔记容器。
:::
```

它适合承载：

- 普通知识补充
- 个人总结
- 与 `warning` 相比风险级别更低的说明

### 3. 标题可自定义

```markdown
::: tip 最佳实践
优先使用最小可运行示例。
:::
```

---

## 三、容器选型建议

### 1. 推荐映射

| 场景 | 推荐容器 | 说明 |
|------|------|------|
| 最佳实践 | `tip` | 给建议、技巧、经验 |
| 普通知识补充 | `note` | 柔和提示，不制造紧张感 |
| 注意事项 | `warning` | 有约束、有前提、有易错点 |
| 高风险操作 | `danger` | 删除、覆盖、不可逆、生产风险 |
| 补充展开 | `details` | 长解释、附录、可折叠内容 |

### 2. 不推荐做法

- 一篇文章里连续堆 5 个以上容器
- 普通正文也套进容器，导致页面像“警告墙”
- 用 `danger` 写普通提示，视觉等级失真
- 容器里再套过多复杂容器，影响可读性

### 3. 对当前仓库的建议

知识库型内容优先采用：

1. 正文段落
2. 必要时 `tip` / `note`
3. 只有明确风险时才用 `warning` / `danger`
4. 过长补充折叠到 `details`

---

## 四、布局类容器

Vdoing 支持一些布局增强容器：

### 1. `center`

用于标题、图片、短句居中。

```markdown
::: center
### 核心结论
该机制的本质是延迟绑定。
:::
```

### 2. `right`

用于引用来源、署名、简短补充。

```markdown
::: right
摘自官方文档
:::
```

### 3. `theorem`

更适合公式、定义、定理、规则类内容，不建议泛用。

```markdown
::: theorem CAP 定理
分布式系统无法同时完全满足一致性、可用性、分区容错性。
:::
```

### 4. 使用边界

- `center` 不要用于大段正文
- `right` 不要承载主内容
- `theorem` 只在确有“定义 / 定律 / 规则块”语义时使用

---

## 五、卡片类容器

Vdoing 提供两类常见卡片容器：

- `cardList`
- `cardImgList`

### 1. 适合场景

- 友情链接
- 资源推荐
- 工具清单
- 项目展示

### 2. 不适合场景

- 常规技术正文
- 章节主体内容
- 需要长解释的知识点

### 3. 基本示例

````markdown
::: cardList 2
```yaml
- name: Spring Security
  desc: Spring 生态中的安全框架
  link: https://spring.io/projects/spring-security
  bgColor: '#F6F8FA'
  textColor: '#24292F'
```
:::
````

> 卡片容器内代码块必须使用 `yaml`，且数据结构要合法。

---

## 六、VuePress 常用 Markdown 扩展

### 1. 目录

```markdown
[[toc]]
```

适合超长文档顶部快速导航，但不要与文章本身已经很重的手写目录重复堆叠。

### 2. 内部链接

优先使用基于文件结构的相对路径，而不是猜 permalink。

```markdown
[查看事务章节](./10.事务.md)
```

### 3. 代码高亮行

````markdown
```java{2,4-6}
public class Demo {
  public static void main(String[] args) {
    System.out.println("hello");
  }
}
```
````

适合教学型内容中强调关键行。

### 4. 代码块语言标识

当前仓库已在 `docs/.vuepress/config.ts` 中兼容了部分别名映射：

- `init` → `bash`
- `mysql` → `sql`
- `yml` → `yaml`
- `shell` → `bash`
- `jsp` → `html`

尽管如此，写作时仍优先使用标准语言名，减少心智负担。

---

## 七、与当前仓库配置强相关的注意事项

### 1. 图片路径尽量不要含中文

当前仓库虽然启用了 `markdown-it-disable-url-encode`，但它更像兜底。
长期方案仍然是：

- 图片文件名改英文或拼音
- 使用相对路径
- 本地化外链图片

### 2. 图片启用了懒加载与缩放

仓库已启用：

- `markdown-it-image-lazy-loading`
- `vuepress-plugin-zooming`

因此：

- 普通正文图片无需额外写复杂展示语法
- 如确实不想让某张图支持缩放，可考虑使用 `no-zoom` 类（需结合实际 HTML 写法）

### 3. 数学公式与 Mermaid

当前配置中：

- 已启用 `markdown-it-mathjax3`
- Mermaid 相关能力处于注释状态，默认不要假设可直接使用

结论：

- 数学公式可以写
- Mermaid 图表在未确认重新启用前，不应作为默认规范推荐

---

## 八、写作建议：什么时候用原生，什么时候用主题增强

### 1. 优先级建议

1. 标准 Markdown
2. VuePress 原生扩展
3. Vdoing 增强容器
4. 自定义 HTML / 复杂嵌入

越往后，表现力越强，但维护成本也越高。

原因很简单：

- 标准 Markdown 迁移成本最低
- VuePress 原生扩展兼容性最好
- Vdoing 增强容器依赖主题能力，主题升级、迁移到其他静态站点方案时成本更高
- 自定义 HTML 最灵活，但最容易引入样式耦合与渲染差异

### 2. 知识库内容的推荐策略

- 教学正文：优先普通标题 + 段落 + 列表 + 代码块
- 重点提示：用 `tip` / `note` / `warning`
- 附加阅读：用 `details`
- 资源推荐页：用 `cardList` / `cardImgList`
- 不到必要时，不引入大段 HTML

---

## 九、常见误区

1. 把 `:::info` 当成默认可用容器
   - 对 VuePress 1 默认主题来说，官方常见容器是
     `tip / warning / danger / details`
   - 当前仓库应优先使用已验证的这些类型与 Vdoing 的 `note`

2. 认为所有 VuePress 插件语法当前仓库都可用
   - 是否可用取决于 `docs/.vuepress/config.ts` 是否启用

3. 用自定义 HTML 代替正常 Markdown
   - 除非为了 demo、布局或主题能力，否则优先 Markdown

4. 在知识型笔记中滥用卡片容器
   - 漂亮归漂亮，但过量会让正文失去连续性

---

## 十、相关参考

- VuePress Markdown 扩展：
  [https://v1.vuepress.vuejs.org/guide/markdown.html](https://v1.vuepress.vuejs.org/guide/markdown.html)
- Vdoing Markdown 容器：
  [https://doc.xugaoyi.com/pages/d0d7eb/](https://doc.xugaoyi.com/pages/d0d7eb/)
- Vdoing 主题配置：
  [https://doc.xugaoyi.com/pages/a20ce8/](https://doc.xugaoyi.com/pages/a20ce8/)
- 仓库实际配置：`docs/.vuepress/config.ts`