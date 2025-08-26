# react-recaptcha

发包流程：

1. 在根目录运行：pnpm changeset（例如选择 react-recaptcha-v2-web，选 patch(是情况而定)）
2. 提交并发 PR 到 main
3. 合并 “Version Packages” PR → CI 会自动发布

ci:

- ci:version
- ci:publish
