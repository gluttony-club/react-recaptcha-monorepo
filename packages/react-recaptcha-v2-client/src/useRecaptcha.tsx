import { useMemoizedFn, useUnmount } from 'ahooks'
import { useRef } from 'react'
import { createRoot } from 'react-dom/client'
import ReCAPTCHA from 'react-google-recaptcha'

import type { Root } from 'react-dom/client'
import type { ReCAPTCHAProps } from 'react-google-recaptcha'

import { listenRecaptchaClose } from './helpers'

import type { ReCaptchaLoaded } from './types'

export function useRecaptcha(props: ReCAPTCHAProps) {
  const { sitekey, asyncScriptOnLoad, ...reset } = props

  const reCaptchaRef = useRef<ReCAPTCHA>(null)
  const reCaptchaLoadedRef = useRef<ReCaptchaLoaded>('init')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const rootRef = useRef<Root | null>(null)

  const onLoad = useMemoizedFn(() => {
    reCaptchaLoadedRef.current = 'loaded'
    asyncScriptOnLoad?.()
  })

  const init = useMemoizedFn(() => {
    if (typeof window === 'undefined') {
      return
    }
    if (reCaptchaLoadedRef.current !== 'init') {
      return
    }
    window.recaptchaOptions = {
      useRecaptchaNet: true,
    }
    reCaptchaLoadedRef.current = 'loading'
    const container = document.createElement('div')
    container.style.position = 'fixed'
    containerRef.current = container
    document.body.appendChild(containerRef.current)
    const root = createRoot(containerRef.current)
    rootRef.current = root
    rootRef.current.render(
      <ReCAPTCHA
        size='invisible'
        isolated
        {...reset}
        sitekey={sitekey}
        ref={reCaptchaRef}
        asyncScriptOnLoad={onLoad}
      />,
    )
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

  useUnmount(() => {
    reCaptchaLoadedRef.current = 'init'
    if (rootRef.current) {
      rootRef.current.unmount()
      rootRef.current = null
    }
    if (containerRef.current) {
      document.body.removeChild(containerRef.current)
      containerRef.current = null
    }
  })

  return {
    init,
    executeAsync,
  }
}
