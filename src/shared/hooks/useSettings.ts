import { useCallback, useEffect, useState } from 'react'
import type { Settings } from '@/shared/types'
import { DEFAULT_SETTINGS } from '@/shared/config'
import { getSettings, setSettings } from '@/entities/settings'

/**
 * 设置 hook：加载并持久化设置。
 * update 会同步写入 chrome.storage.sync。
 */
export function useSettings() {
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSettings().then((s) => {
      setSettingsState(s)
      setLoading(false)
    })
  }, [])

  const update = useCallback(async (patch: Partial<Settings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...patch }
      setSettings(next)
      return next
    })
  }, [])

  return { settings, loading, update }
}
