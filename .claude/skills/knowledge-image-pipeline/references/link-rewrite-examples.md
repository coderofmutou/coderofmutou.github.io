# 本地化与路径修复示例

## 外链改本地

```markdown
# before
![流程图](https://example.com/a/b/c.png)

# after
![流程图](./MyBatis.assets/c.webp)
```

## 绝对路径改相对路径

```markdown
# before
![结果图](/docs/03.微服务生态/10.安全框架/SpringSecurity.assets/result.png)

# after
![结果图](./SpringSecurity.assets/result.webp)
```

## 中文路径风险提示

```markdown
- 若图片路径包含中文，部署环境可能出现编码差异。
- 优先将图片文件名改为英文或拼音，并统一相对路径引用。
```
