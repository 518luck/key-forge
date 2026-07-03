import type { Settings } from '@/shared/types'
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '@/shared/config'

/** 读取设置，缺失字段用默认值补全（兼容旧版本） */
export async function getSettings(): Promise<Settings> {
  const result = await chrome.storage.sync.get(STORAGE_KEYS.settings)
  const stored = result[STORAGE_KEYS.settings] as Partial<Settings> | undefined
  return mergeSettings(DEFAULT_SETTINGS, stored)
}

/** 写入设置 */
export async function setSettings(settings: Settings): Promise<void> {
  await chrome.storage.sync.set({ [STORAGE_KEYS.settings]: settings })
}

/** 深度合并设置，保证嵌套字段缺失时有默认值 */
function mergeSettings(base: Settings, partial?: Partial<Settings>): Settings {
  if (!partial) return structuredClone(base)
  return {
    password: {
      ...base.password,
      ...partial.password,
      flags: { ...base.password.flags, ...partial.password?.flags },
    },
    historyLimit: partial.historyLimit ?? base.historyLimit,
  }
}
