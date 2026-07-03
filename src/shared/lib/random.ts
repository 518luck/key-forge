/**
 * 密码学安全的随机数工具。
 *
 * 全部基于 crypto.getRandomValues + 拒绝采样（rejection sampling），
 * 消除模偏差（modulo bias），严禁使用 Math.random()。
 */

/**
 * 返回 [0, max) 范围内的密码学安全随机整数。
 *
 * 实现说明：用 crypto.getRandomValues 取随机字节，但若直接对 max 取模，
 * 当 max 不能整除最大值时会产生偏差。这里采用拒绝采样——
 * 丢弃落在不均匀区间内的值，重新采样，保证每个整数被选中的概率均等。
 *
 * @param max 上界（不包含），必须 > 0
 */
export function getRandomInt(max: number): number {
  if (max <= 0) throw new Error('max must be positive')
  if (!Number.isSafeInteger(max)) throw new Error('max must be a safe integer')

  // 能用 Uint8Array（0–255）就够的范围，直接用；否则升级到 32 位。
  const useUint32 = max > 256
  const limit = useUint32 ? 0x100000000 : 0x100

  // 拒绝采样的上界：小于 limit 的最大 max 的整数倍
  const rejectLimit = limit - (limit % max)

  const buf = useUint32 ? new Uint32Array(1) : new Uint8Array(1)
  while (true) {
    crypto.getRandomValues(buf)
    const value = buf[0]
    if (value < rejectLimit) {
      return value % max
    }
    // 落在不均匀区间，丢弃重来
  }
}

/**
 * 从数组中随机选取一个元素。
 */
export function pickRandom<T>(arr: readonly T[]): T {
  return arr[getRandomInt(arr.length)]
}

/**
 * 密码学安全地打乱数组（Fisher–Yates 洗牌），返回新数组。
 */
export function shuffle<T>(arr: readonly T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = getRandomInt(i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * 生成一个不可预测的随机 ID（用于历史记录项）。
 */
export function generateId(): string {
  const buf = new Uint32Array(4)
  crypto.getRandomValues(buf)
  return Array.from(buf, (n) => n.toString(16).padStart(8, '0')).join('')
}
