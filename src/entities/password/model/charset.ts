import type { CharsetFlag, PasswordConfig } from '@/shared/types'
import { AMBIGUOUS_CHARS } from '@/shared/config'

/** 各字符集对应的字符串 */
export const CHARSET_STRINGS: Record<CharsetFlag, string> = {
  digits: '0123456789',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  symbols: '!@#$%^&*-_=+?/.><;:~',
}

/**
 * 根据配置计算最终可用字符集。
 *
 * 三层过滤叠加：
 * 1. 按 flags 选择启用的字符集
 * 2. 若 excludeAmbiguous，剔除易混淆字符
 * 3. 若 excludeChars 非空，剔除用户自定义字符
 *
 * @returns 去重后的字符集字符串；若为空表示无法生成
 */
export function resolveCharset(config: PasswordConfig): string {
  let pool = ''
  for (const flag of Object.keys(CHARSET_STRINGS) as CharsetFlag[]) {
    if (config.flags[flag]) {
      pool += CHARSET_STRINGS[flag]
    }
  }

  if (config.excludeAmbiguous) {
    const remove = new Set(AMBIGUOUS_CHARS)
    pool = [...pool].filter((c) => !remove.has(c)).join('')
  }

  if (config.excludeChars) {
    const remove = new Set(config.excludeChars)
    pool = [...pool].filter((c) => !remove.has(c)).join('')
  }

  // 去重，避免同一字符多次出现影响分布
  return [...new Set(pool)].join('')
}
