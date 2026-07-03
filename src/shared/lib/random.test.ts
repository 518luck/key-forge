import { describe, it, expect } from 'vitest'
import { getRandomInt, pickRandom, shuffle, generateId } from './random'

describe('getRandomInt', () => {
  it('返回值在 [0, max) 范围内', () => {
    for (let i = 0; i < 1000; i++) {
      const v = getRandomInt(10)
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(10)
    }
  })

  it('max=1 时始终返回 0', () => {
    for (let i = 0; i < 100; i++) {
      expect(getRandomInt(1)).toBe(0)
    }
  })

  it('对 max <= 0 抛错', () => {
    expect(() => getRandomInt(0)).toThrow()
    expect(() => getRandomInt(-1)).toThrow()
  })

  it('大范围也均匀分布（卡方近似）', () => {
    const max = 52 // 字母表大小，模拟字符集
    const counts = new Array(max).fill(0)
    const total = 52000
    for (let i = 0; i < total; i++) {
      counts[getRandomInt(max)]++
    }
    // 每个值期望 = total / max，允许 ±20% 波动
    const expected = total / max
    const tolerance = expected * 0.2
    for (const c of counts) {
      expect(c).toBeGreaterThan(expected - tolerance)
      expect(c).toBeLessThan(expected + tolerance)
    }
  })

  it('256 以上范围（走 Uint32）也正常', () => {
    for (let i = 0; i < 1000; i++) {
      const v = getRandomInt(1000)
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1000)
    }
  })
})

describe('pickRandom', () => {
  it('返回数组中的元素', () => {
    const arr = ['a', 'b', 'c']
    for (let i = 0; i < 100; i++) {
      expect(arr).toContain(pickRandom(arr))
    }
  })
})

describe('shuffle', () => {
  it('不改变数组长度和元素集合', () => {
    const arr = [1, 2, 3, 4, 5]
    const shuffled = shuffle(arr)
    expect(shuffled).toHaveLength(arr.length)
    expect(shuffled.sort()).toEqual([...arr].sort())
  })

  it('不修改原数组', () => {
    const arr = [1, 2, 3]
    const snapshot = [...arr]
    shuffle(arr)
    expect(arr).toEqual(snapshot)
  })
})

describe('generateId', () => {
  it('返回 32 位十六进制字符串', () => {
    const id = generateId()
    expect(id).toHaveLength(32)
    expect(id).toMatch(/^[0-9a-f]{32}$/)
  })

  it('每次生成不同', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()))
    expect(ids.size).toBe(100)
  })
})
