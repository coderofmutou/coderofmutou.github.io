# 已有笔记更新维护指南

对知识库中**已存在的笔记**进行更新、补充或重构时的操作规范。

---

## 一、更新场景分类

| 场景 | 典型触发条件 |
|------|-------------|
| 技术版本升级 | 框架发布新大版本，API / 配置方式有变化 |
| 补充遗漏知识点 | 使用中发现某个重要用法原笔记未覆盖 |
| 修正错误内容 | 发现原笔记存在描述错误或过时信息 |
| 结构重构 | 原笔记章节混乱，需要重新组织 |
| 单文件拆分 | 单文件过长（>500 行），需要按章节拆成多文件 |

---

## 二、版本共存原则（核心）

知识库笔记记录的是某个时间点的技术使用方式，技术本身会持续迭代。**除非旧版本已完全停止维护且绝无参考价值，否则新旧版本内容都应保留并明确标注版本范围。**

### 决策树：替换 vs 共存

```
新版本内容准备补充时，先问：
│
├─ 旧版本是否还有人在使用？（如仍有大量 Spring Boot 2 项目）
│   ├─ 是 → 共存，标注版本
│   └─ 否 → 继续判断 ↓
│
├─ 旧版本 API/配置是否已完全作废？（deprecated 且官方不再支持）
│   ├─ 是 → 可以替换，保留一句"旧版已废弃"的说明
│   └─ 否 → 共存，标注版本
│
└─ 两个版本差异是否极小？（如只有一行配置不同）
    ├─ 是 → 在同一处用注释/说明标出差异即可，不必拆章节
    └─ 否 → 拆独立章节共存
```

**常见技术的版本共存场景举例：**

| 技术 | 典型版本分界 | 处理方式 |
|------|------------|----------|
| Spring Boot | 2.x → 3.x（Jakarta EE 迁移） | 核心配置章节拆分共存 |
| Spring Security | 5.x → 6.x（WebSecurityConfigurerAdapter 废弃） | 配置写法章节拆分共存 |
| MyBatis | 3.4 → 3.5（Lambda 条件构造） | 差异小，同节内注释说明即可 |
| JDK | 8 → 11 → 17 → 21（新特性） | 各版本新特性追加到对应章节 |
| MySQL | 5.7 → 8.x（窗口函数、JSON 等） | 8.x 新特性追加章节 |

---

### 标注方式一：差异较小，同节内标注

适用于：两个版本只有一两处配置/API 不同。

```markdown
## 配置数据源

```yaml
# Spring Boot 3.x（自动推断驱动，无需显式指定）
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/demo
    username: root
    password: 123456
```

> **Spring Boot 2.x 差异**：需显式添加 `driver-class-name: com.mysql.cj.jdbc.Driver`。
```

### 标注方式二：差异较大，拆独立章节

适用于：配置方式或 API 有根本性变化（Breaking Change）。

在章节标题后括号注明版本范围：

```markdown
## 安全配置（Spring Security 6.x / Spring Boot 3.x）

继承 `SecurityFilterChain` Bean 方式配置...

---

## 安全配置（Spring Security 5.x / Spring Boot 2.x）

继承 `WebSecurityConfigurerAdapter` 方式配置...
```

> 新版本章节放在前面，旧版本章节放在后面，保持"新前旧后"顺序。

### 标注方式三：文件级版本分离

适用于：某个技术的两个大版本用法差异极大，放在同一文件会造成混乱。

```
50.持久层框架/
  10.MyBatis.md                         ← 通用内容（概念、理论）
  11.MyBatis-SpringBoot2集成.md         ← Spring Boot 2.x 集成方式
  12.MyBatis-SpringBoot3集成.md         ← Spring Boot 3.x 集成方式
```

frontmatter 的 `title` 应包含版本信息：
```yaml
title: MyBatis 与 Spring Boot 3.x 集成
```

---

### 版本标注的通用格式

- 版本号使用具体数字，如 `Spring Boot 3.x` 而非 `新版本`
- 若已知确切废弃/引入版本，标注精确版本号：`自 Spring Security 6.0 起`
- 版本注释统一放在该章节**开头**，避免读者读完才发现版本不对：

```markdown
## 过滤器链配置

> 本节内容适用于 **Spring Security 6.x（Spring Boot 3.x）**。
> Spring Security 5.x 的配置方式见 [安全配置（5.x）](#安全配置spring-security-5x--spring-boot-2x)。
```

---

## 三、补充遗漏知识点

1. 确认该知识点应归属的章节位置（参照现有大纲）
2. 补充时保持与原文风格一致（标题层级、代码风格）
3. 若是个人实践中发现的用法，用 `> 💡 个人注：` 格式标注来源
4. 更新 frontmatter 的 `date` 字段为修改日期（`lastUpdated` 依赖 git 提交时间，frontmatter 的 date 是创建日期，一般**不需要修改**）

---

## 四、单文件拆分为多文件

当单个笔记文件过长时，按章节拆分：

**拆分前：**
```
02.MyBatis.md   （800行，涵盖基础 + 动态SQL + 缓存 + 插件）
```

**拆分后：**
```
50.持久层框架/
  MyBatis/                          ← 新建同名文件夹（不含数字前缀）
    10.MyBatis-基础.md
    20.MyBatis-动态SQL.md
    30.MyBatis-缓存与插件.md
```

**注意事项：**
- 原文件的 `permalink` 如果已发布并被外部引用，不要随意变更（会造成死链）
- 拆分后每个文件需独立的 frontmatter，`permalink` 在原基础上加子路径
- 若原文件 permalink 为 `/micro-service-core/MyBatis/`，则子文件改为：
  - `/micro-service-core/MyBatis/basics/`
  - `/micro-service-core/MyBatis/dynamic-sql/`
- 原文件可改为目录索引页（`article: false`），或直接删除后在 `config.ts` 更新导航链接

---

## 五、图片维护

已有笔记中的图片需要维护时：

- **发现图片失效（外链 404）**：重新下载或找替代图，若无法替代改为文字描述
- **图片未转 webp**：运行 `utils/compress/compress_images.py`
- **发现冗余图片占用空间**：运行 `utils/compress/search_unused_images.py` 找出未引用图片后删除

---

## 六、frontmatter 字段更新注意事项

| 字段 | 是否可修改 | 说明 |
|------|-----------|------|
| `title` | ✅ 可改 | 修改后侧边栏和 tab 标题随之变化 |
| `permalink` | ⚠️ 谨慎 | 一旦发布不建议修改，会导致外部链接失效 |
| `date` | ❌ 不改 | 代表创建日期，不要用作"最后修改日期" |
| `categories` | ✅ 可改 | 修改后在分类页的归属随之变化 |
| `tags` | ✅ 可改 | 自由添加/删除 |
| `author` | ✅ 可改 | 通常保持 bombax 不变 |
