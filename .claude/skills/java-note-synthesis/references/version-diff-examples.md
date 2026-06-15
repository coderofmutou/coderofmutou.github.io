# 版本差异标注示例

## 同节差异（适合轻微变化）

```markdown
> **Spring Security 5.x / 6.x 差异**：
> 6.x 移除了 `WebSecurityConfigurerAdapter`，推荐基于 `SecurityFilterChain` 配置。
```

## 分节差异（适合中等变化）

```markdown
## 安全配置（5.x）

...旧版本做法...

## 安全配置（6.x）

...新版本做法...
```

## 分文件差异（适合大改动）

- `SpringSecurity-5.x.md`
- `SpringSecurity-6.x.md`

并在总览文档加跳转：

```markdown
- [Spring Security 5.x](./SpringSecurity-5.x.md)
- [Spring Security 6.x](./SpringSecurity-6.x.md)
```
