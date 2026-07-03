import type { PasswordConfig } from '@/shared/types'
import { resolveCharset } from './charset'
import { getRandomInt } from '@/shared/lib/random'

/**
 * 生成随机密码。
 *
 * @param config 密码配置
 * @returns 生成的密码字符串；若字符集为空返回 null
 */
export function generatePassword(config: PasswordConfig): string | null {
  const charset = resolveCharset(config)
  if (charset.length === 0) return null

  let result = ''
  for (let i = 0; i < config.length; i++) {
    result += charset[getRandomInt(charset.length)]
  }
  return result
}
