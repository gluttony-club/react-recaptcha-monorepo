# react-recaptcha-v2-web

一个基于 `react-google-recaptcha` 的轻量 Hook，封装了 Invisible reCAPTCHA v2 的加载、渲染与执行，提供简单一致的 API：`init` 与 `executeAsync`。

## 特性

- **Invisible 模式**：不破坏页面布局，按需弹出验证码。
- **即插即用**：传入 `sitekey` 即可，剩下的渲染/卸载全自动。
- **大陆网络优化**：默认设置 `window.recaptchaOptions.useRecaptchaNet = true`。
- **SSR 友好**：内部对 `window` 做了存在性判断。

## 安装

```bash
pnpm add react-recaptcha-v2-web
# 或
npm i react-recaptcha-v2-web
```

Peer 依赖：

- react >= 18 或 19
- react-dom >= 18 或 19

## 快速上手

```tsx
import { useEffect } from 'react'
import { useRecaptcha } from 'react-recaptcha-v2-web'

export default function Demo() {
  const { init, executeAsync } = useRecaptcha({
    sitekey: 'your_site_key',
    // 其余 props 透传给 react-google-recaptcha，如：hl、badge、onErrored 等
  })

  useEffect(() => {
    // 首次进入或需要使用前初始化（仅在浏览器环境执行）
    init()
  }, [init])

  const handleSubmit = async () => {
    try {
      // 弹出验证码并等待完成；自动在成功后 reset
      const token = await executeAsync()
      // 将 token 提交到服务端校验
      console.log('recaptcha token: ', token)
    } catch (e) {
      // 未加载完成或用户关闭了弹窗等情况
      console.error(e)
    }
  }

  return <button onClick={handleSubmit}>提交</button>
}
```

## 许可证

MIT
