# config.ts 导航维护指南

`docs/.vuepress/config.ts` 是项目主配置文件，本文件聚焦于 **nav 导航菜单** 的维护方法。

---

## 导航结构总览

```
nav (数组)
├── { text: '首页', link: '/' }
├── { text: '一级导航', link: '/permalink/', items: [...] }
│   └── items 中的分组：
│       { text: '分组名', items: [ { text: '子项', link: '...' } ] }
└── { text: '索引', link: '/archives/', items: [...] }
```

---

## 一、新增一级导航（新主题分类）

**修改位置**：`config.ts` > `themeConfig.nav` 数组

**步骤：**

1. 在 `nav` 数组中插入新对象（插入到「索引」菜单之前）：

```typescript
{
  text: '{导航显示名称}',
  link: '/{permalink}/',   // 对应目录页的 permalink
  items: [
    {
      text: '{分组名}',
      items: [
        { text: '{子页面名}', link: '/{子页面 permalink}/' },
      ],
    },
  ],
},
```

2. 在 `docs/00.目录页/` 下新建目录页文件（见 [frontmatter 模板 - 目录页](./frontmatter-template.md#目录页catalogue-page)）。

3. 在 `docs/` 下新建对应的一级文件夹，如 `05.新主题/`（注意数字前缀要在已有文件夹之后）。

**示例**（参照现有结构）：

```typescript
// 现有：
{ text: '实用工具', link: '/tools/', items: [...] },
// 新增（插入实用工具之后、索引之前）：
{
  text: '前端进阶',
  link: '/frontend/',
  items: [
    {
      text: 'Vue',
      items: [
        { text: 'Vue3 基础', link: '/frontend/vue3-basics/' },
      ],
    },
  ],
},
```

---

## 二、在现有一级导航下新增子项

找到对应的 `items` 数组，在合适的分组下添加：

```typescript
{ text: '{显示名称}', link: '/{已定义的 permalink}/' },
```

> ⚠️ `link` 的值必须与目标 md 文件 frontmatter 中的 `permalink` **完全一致**，包括末尾斜杠。

---

## 三、「更多」导航（外链资源）

`更多` 菜单只包含外部链接，格式：

```typescript
{ text: '{名称}', link: 'https://...' },
```

不需要对应本地 md 文件，直接添加到 `更多` 的 `items` 数组中即可。

---

## 四、注释掉暂不使用的条目

项目中大量使用 `/* ... */` 注释掉未完成的导航项，是正常做法。
未完成的笔记对应的 nav 条目建议**先注释，待笔记完成后再取消注释**。

---

## 五、sidebar 配置说明

项目使用 `sidebar: 'structuring'`，**无需手动维护 sidebar 配置**。
vdoing 主题会根据 `docs/` 下的文件夹结构和 md 文件 frontmatter **自动生成**侧边栏。

自动生成规则：
- 按文件夹 / 文件名的数字前缀排序
- 文件夹名格式：`{02位数}.{中文名}` → 数字越小越靠前
- 文件名格式同上
- 侧边栏深度由 `sidebarDepth: 2` 控制（显示到 H3）

---

## 六、常用配置项速查

| 配置项 | 当前值 | 说明 |
|--------|--------|------|
| `sidebarDepth` | `2` | 侧边栏深度，最大 2（显示到 H3）|
| `logo` | `/img/logo.webp` | 导航栏 logo，存于 `public/img/` |
| `repo` | `coderofmutou/coderofmutou.github.io` | 右上角 GitHub 链接 |
| `searchMaxSuggestions` | `10` | 搜索最大结果数 |
| `lastUpdated` | `'上次更新'` | 文章底部最后更新时间 |
| `pageStyle` | `'card'` | 页面风格：`card` 或 `line` |
| `sidebar` | `'structuring'` | 侧边栏模式，不要修改 |
| `author.name` | `'bombax'` | 默认作者名 |
| `docsBranch` | `'main'` | 文档所在 Git 分支 |
