import { describe, it, expect } from 'vitest'
import { resolveCharset } from './charset'
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

describe('resolveCharset', () => {
  it('默认包含数字、大小写、符号', () => {
    const charset = resolveCharset(makeConfig())
    expect(charset).toContain('0')
    expect(charset).toContain('A')
    expect(charset).toContain('a')
    expect(charset).toContain('!')
  })

  it('仅启用数字时只含数字', () => {
    const charset = resolveCharset(
      makeConfig({
        flags: { digits: true, uppercase: false, lowercase: false, symbols: false },
      }),
    )
    expect(charset).toBe('0123456789')
  })

  it('excludeAmbiguous 剔除易混淆字符', () => {
    const charset = resolveCharset(makeConfig({ excludeAmbiguous: true }))
    expect(charset).not.toContain('0')
    expect(charset).not.toContain('O')
    expect(charset).not.toContain('o')
    expect(charset).not.toContain('1')
    expect(charset).not.toContain('l')
    expect(charset).not.toContain('I')
    expect(charset).not.toContain('|')
    expect(charset).not.toContain('`')
    expect(charset).not.toContain("'")
    expect(charset).not.toContain('"')
  })

  it('excludeChars 剔除用户自定义字符', () => {
    const charset = resolveCharset(makeConfig({ excludeChars: '"< abc' }))
    expect(charset).not.toContain('"')
    expect(charset).not.toContain('<')
    expect(charset).not.toContain('a')
    expect(charset).not.toContain('b')
    expect(charset).not.toContain('c')
  })

  it('易混淆 + 自定义排除叠加', () => {
    const charset = resolveCharset(
      makeConfig({ excludeAmbiguous: true, excludeChars: '!@' }),
    )
    expect(charset).not.toContain('0')
    expect(charset).not.toContain('!')
    expect(charset).not.toContain('@')
  })

  it('全部字符集关闭时返回空字符串', () => {
    const charset = resolveCharset(
      makeConfig({
        flags: { digits: false, uppercase: false, lowercase: false, symbols: false },
      }),
    )
    expect(charset).toBe('')
  })

  it('去重：排除后重复字符不残留', () => {
    const charset = resolveCharset(makeConfig())
    const unique = new Set(charset)
    expect(charset.length).toBe(unique.size)
  })
})
