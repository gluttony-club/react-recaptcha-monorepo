import { DEFAULT_API_URL } from './data'
import { getFetch } from './helpers'

import type { VerifyRecaptchaResponse } from './types'

interface VerifyRecaptchaProps {
  secret: string
  response: string
}

// params and response: https://developers.google.com/recaptcha/docs/verify?hl=zh-cn
/**
 * @description Verify recaptcha, throw error if failed
 * @param props {secret, response}
 */
export async function verifyRecaptcha(props: VerifyRecaptchaProps) {
  const { response, secret } = props

  if (!secret) {
    throw new Error('missing-input-secret')
  }

  if (!response) {
    throw new Error('missing-input-response')
  }

  const formData = new URLSearchParams({
    secret,
    response,
  })

  const _fetch = await getFetch()
  const res = await _fetch(DEFAULT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  })

  const data = await res.json() as VerifyRecaptchaResponse
  if (!data?.success) {
    const errorCode = data?.['error-codes']?.join(',') || 'bad-request'
    throw new Error(errorCode)
  }
}
