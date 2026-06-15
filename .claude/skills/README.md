# 知识库 Skills 总览

本仓库共有 3 个 Skill，分层管理。

## 技能地图

```
vdoing-knowledge-base（总入口 / 调度 / 验收）
├── java-note-synthesis（笔记整合专项）
└── knowledge-image-pipeline（图片治理专项）
```

## 快速路由

| 你的需求 | 推荐 Skill |
|----------|-----------|
| 新增一篇 Java/Spring/MyBatis 笔记 | `vdoing-knowledge-base` |
| 更新导航栏（config.ts）或目录页 | `vdoing-knowledge-base` |
| 完善 frontmatter / permalink | `vdoing-knowledge-base` |
| 将多份课程资料整合为一篇笔记 | `java-note-synthesis` |
| 处理版本差异（如 Spring Boot 2→3）| `java-note-synthesis` |
| 现有笔记去噪/去重/结构优化 | `java-note-synthesis` |
| 下载外链图片并本地化 | `knowledge-image-pipeline` |
| 批量图片转 webp / 压缩 | `knowledge-image-pipeline` |
| 清理未使用图片 | `knowledge-image-pipeline` |
| 修复图片 404 / 路径中文问题 | `knowledge-image-pipeline` |
| 全流程（整合 + 图片 + 导航更新） | 先 `java-note-synthesis` → 再 `knowledge-image-pipeline` → 最后 `vdoing-knowledge-base` 验收 |

## 示例 Prompt

```
/vdoing-knowledge-base 新增 Redis 笔记到 docs/02.微服务核心，需要更新导航
/java-note-synthesis 整合三份 MyBatis 动态 SQL 资料，输出一篇面向面试的笔记
/knowledge-image-pipeline 处理 docs/03.微服务生态 下所有外链图片并转 webp
```

## 各 Skill 详情

| Skill | 文件 | 参考文档 |
|-------|------|----------|
| `vdoing-knowledge-base` | [SKILL.md](./vdoing-knowledge-base/SKILL.md) | [frontmatter 模板](./vdoing-knowledge-base/references/frontmatter-template.md) · [config 指南](./vdoing-knowledge-base/references/config-guide.md) · [笔记整合](./vdoing-knowledge-base/references/note-synthesis.md) · [笔记维护](./vdoing-knowledge-base/references/note-maintenance.md) · [Git 规范](./vdoing-knowledge-base/references/git-commit-guide.md) |
| `java-note-synthesis` | [SKILL.md](./java-note-synthesis/SKILL.md) | [整合模板](./java-note-synthesis/references/synthesis-template.md) · [版本差异示例](./java-note-synthesis/references/version-diff-examples.md) |
| `knowledge-image-pipeline` | [SKILL.md](./knowledge-image-pipeline/SKILL.md) | [执行清单](./knowledge-image-pipeline/references/pipeline-checklist.md) · [路径修复示例](./knowledge-image-pipeline/references/link-rewrite-examples.md) |
