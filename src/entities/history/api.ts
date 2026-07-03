import type { HistoryItem } from '@/shared/types'
import { STORAGE_KEYS } from '@/shared/config'

/** 读取全部历史记录（最新在前） */
export async function getHistory(): Promise<HistoryItem[]> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.history)
  return (result[STORAGE_KEYS.history] as HistoryItem[] | undefined) ?? []
}

/** 写入全部历史记录 */
export async function setHistory(items: HistoryItem[]): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEYS.history]: items })
}
