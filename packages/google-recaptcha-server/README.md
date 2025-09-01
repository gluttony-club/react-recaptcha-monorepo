## google-recaptcha-server

Google reCAPTCHA 服务端校验工具。

### 特性

- 在服务端校验 reCAPTCHA token
- 兼容多种运行时：Node（18+ 原生 fetch）、Deno、Bun、Workers
- 若全局不存在 `fetch`，将动态回退到 `node-fetch`
- API 精简，默认值友好

### 安装

本包作为工作区内的独立包发布。

```bash
pnpm add google-recaptcha-server
```

对于 Node < 18：本包在需要时会动态加载 `node-fetch` 作为回退（已声明为可选依赖），通常无需你额外安装。

### 使用

```ts
import { verifyRecaptcha } from 'google-recaptcha-server'

// await 成功即代表校验通过；失败会抛出错误（错误码）
await verifyRecaptcha({
  response: '<client-token>',
  secret: process.env.RECAPTCHA_SECRET!,
})
```

### API

#### 导出：`verifyRecaptcha(props)`

参数：

- `secret: string` – 服务端密钥
- `response: string` – reCAPTCHA 小部件返回的客户端 token

返回：`Promise<void>` – 成功 resolve；失败会抛出错误。错误信息可能为以下错误码之一：`missing-input-secret`、`invalid-input-secret`、`missing-input-response`、`invalid-input-response`、`bad-request`、`timeout-or-duplicate`。

### 运行时兼容

- Node 18+：使用原生全局 `fetch` 与 `URLSearchParams`
- Node < 18：在缺失时动态引入 `node-fetch` 作为回退
- Deno/Bun/Workers：使用各自的全局 `fetch`

注意：校验必须在服务端执行，切勿在客户端/浏览器暴露你的 `secretKey`。

### 常见问题

- 400/401 并伴随错误码：通常表示 token 无效、secretKey 错误或域名不匹配。
- 运行平台若无全局 `fetch`：模块会尝试动态加载 `node-fetch`。
- 公司代理/防火墙可能拦截 Google 出站请求：请将校验接口加入允许列表。

### 许可证

ISC
