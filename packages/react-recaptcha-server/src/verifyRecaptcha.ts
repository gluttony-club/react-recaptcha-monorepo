import { DEFAULT_API_URL } from './data'
import { getFetch } from './helpers'

interface VerifyRecaptchaProps {
  token: string
  secretKey: string
}

export async function verifyRecaptcha(props: VerifyRecaptchaProps) {
  const { token, secretKey } = props

  if (!secretKey || !token) {
    throw new Error('secretKey and token are required')
  }

  const formData = new URLSearchParams({
    secret: secretKey,
    response: token,
  })

  const _fetch = await getFetch()
  const response = await _fetch(DEFAULT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  })

  const result = await response.json() as { success: boolean }
  return result.success
}
