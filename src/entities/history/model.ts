import type { HistoryItem } from '@/shared/types'
import { generateId } from '@/shared/lib/random'
import { getHistory, setHistory } from './api'

/**
 * 添加一条历史记录，自动截断到 limit 条（保留最新）。
 * 返回更新后的列表。
 */
export async function addHistoryItem(
  value: string,
  limit: number,
): Promise<HistoryItem[]> {
  const item: HistoryItem = {
    id: generateId(),
    value,
    createdAt: Date.now(),
  }
  const items = await getHistory()
  // 最新在前，头部插入
  const updated = [item, ...items].slice(0, Math.max(0, limit))
  await setHistory(updated)
  return updated
}

/** 删除指定 id 的历史记录，返回更新后的列表 */
export async function removeHistoryItem(id: string): Promise<HistoryItem[]> {
  const items = await getHistory()
  const updated = items.filter((item) => item.id !== id)
  await setHistory(updated)
  return updated
}

/** 清空全部历史 */
export async function clearHistory(): Promise<void> {
  await setHistory([])
}
