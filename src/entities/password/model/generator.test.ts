import { describe, it, expect } from 'vitest'
import { generatePassword } from './generator'
import type { PasswordConfig } from '@/shared/types'

function makeConfig(patch: Partial<PasswordConfig> = {}): PasswordConfig {
  return {
    length: 16,
    flags: { digits: true, uppercase: true, lowercase: true, symbols: true },
    excludeAmbiguous: false,
    excludeChars: '',
    ...patch,
  }
}

describe('generatePassword', () => {
  it('生成长度等于配置长度', () => {
    const pwd = generatePassword(makeConfig({ length: 20 }))
    expect(pwd).toHaveLength(20)
  })

  it('字符集为空时返回 null', () => {
    const pwd = generatePassword(
      makeConfig({
        flags: { digits: false, uppercase: false, lowercase: false, symbols: false },
      }),
    )
    expect(pwd).toBeNull()
  })

  it('排除后字符集为空也返回 null', () => {
    // 数字集 0-9，全排除
    const pwd = generatePassword(
      makeConfig({
        flags: { digits: true, uppercase: false, lowercase: false, symbols: false },
        excludeChars: '0123456789',
      }),
    )
    expect(pwd).toBeNull()
  })

  it('生成的密码只含允许的字符', () => {
    const charset = 'abc'
    const pwd = generatePassword(
      makeConfig({
        flags: { digits: false, uppercase: false, lowercase: true, symbols: false },
        excludeChars: 'defghijklmnopqrstuvwxyz',
      }),
    )
    expect(pwd).not.toBeNull()
    for (const ch of pwd!) {
      expect(charset).toContain(ch)
    }
  })

  it('两次生成几乎必然不同（概率性）', () => {
    const a = generatePassword(makeConfig({ length: 32 }))
    const b = generatePassword(makeConfig({ length: 32 }))
    expect(a).not.toEqual(b)
  })

  it('排除自定义字符后不含该字符', () => {
    const pwd = generatePassword(makeConfig({ excludeChars: '!@#' }))
    expect(pwd).not.toBeNull()
    expect(pwd!).not.toMatch(/[!@#]/)
  })
})
