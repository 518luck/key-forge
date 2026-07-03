import { useCallback, useEffect, useState } from 'react'
import type { HistoryItem } from '@/shared/types'
import {
  addHistoryItem,
  clearHistory,
  getHistory,
  removeHistoryItem,
} from '@/entities/history'

/**
 * 历史记录管理 hook。
 *
 * 加载历史列表，提供添加 / 删除 / 清空操作，自动同步到 storage。
 */
export function useHistory(limit: number) {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setItems(await getHistory())
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const add = useCallback(
    async (value: string) => {
      const updated = await addHistoryItem(value, limit)
      setItems(updated)
    },
    [limit],
  )

  const remove = useCallback(async (id: string) => {
    setItems(await removeHistoryItem(id))
  }, [])

  const clear = useCallback(async () => {
    await clearHistory()
    setItems([])
  }, [])

  return { items, loading, add, remove, clear, refresh }
}
