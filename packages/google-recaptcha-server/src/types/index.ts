export type VerifyRecaptchaErrorCode = 'missing-input-secret' | 'invalid-input-secret' | 'missing-input-response' | 'invalid-input-response' | 'bad-request' | 'timeout-or-duplicate'

export interface VerifyRecaptchaResponse {
  'success': boolean
  'error-codes'?: VerifyRecaptchaErrorCode[]
}
