import { useMemoizedFn } from 'ahooks'
import { useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { ReCAPTCHA } from 'react-google-recaptcha'

import type { ReCAPTCHAProps } from 'react-google-recaptcha'

import { listenRecaptchaClose } from './helpers'

import type { ReCaptchaLoaded } from './types'

export function useRecaptcha(props: ReCAPTCHAProps) {
  const { sitekey, asyncScriptOnLoad, ...reset } = props

  const reCaptchaRef = useRef<ReCAPTCHA>(null)
  const reCaptchaLoadedRef = useRef<ReCaptchaLoaded>('init')

  const onLoad = useMemoizedFn(() => {
    reCaptchaLoadedRef.current = 'loaded'
    window.recaptchaOptions = {
      useRecaptchaNet: true,
    }
    asyncScriptOnLoad?.()
  })

  const init = useMemoizedFn(() => {
    if (reCaptchaLoadedRef.current === 'init') {
      reCaptchaLoadedRef.current = 'loading'
      const root = createRoot(document.body)
      root.render(
        <ReCAPTCHA
          size='invisible'
          isolated
          {...reset}
          sitekey={sitekey}
          ref={reCaptchaRef}
          asyncScriptOnLoad={onLoad}
        />,
      )
    }
  })

  const executeAsync = useMemoizedFn(async () => {
    if (reCaptchaLoadedRef.current !== 'loaded' || !reCaptchaRef.current) {
      throw new Error('reCaptcha not ready')
    }
    const token = await Promise.race([
      reCaptchaRef.current.executeAsync(),
      listenRecaptchaClose(),
    ])
    if (token) {
      reCaptchaRef.current.reset()
    }
    return token || ''
  })

  return {
    init,
    executeAsync,
  }
}
