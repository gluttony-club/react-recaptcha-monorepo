export type ReCaptchaLoaded = 'init' | 'loading' | 'loaded'

export interface UseRecaptchaResult {
  init: () => void
  executeAsync: () => Promise<string>
}
