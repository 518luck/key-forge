import type { Settings, Theme } from '@/shared/types'

/** 密码长度范围 */
export const LENGTH_MIN = 8
export const LENGTH_MAX = 64
export const LENGTH_DEFAULT = 16

/** 历史记录条数范围 */
export const HISTORY_LIMIT_MIN = 5
export const HISTORY_LIMIT_MAX = 100
export const HISTORY_LIMIT_DEFAULT = 20

/** 易混淆字符集合 */
export const AMBIGUOUS_CHARS = "0Oo1lI|`'\""

/** 默认主题 */
export const DEFAULT_THEME: Theme = 'system'

/** 默认设置 */
export const DEFAULT_SETTINGS: Settings = {
  password: {
    length: LENGTH_DEFAULT,
    flags: {
      digits: true,
      uppercase: true,
      lowercase: true,
      symbols: true,
    },
    excludeAmbiguous: false,
    excludeChars: '',
  },
  historyLimit: HISTORY_LIMIT_DEFAULT,
  theme: DEFAULT_THEME,
}

/** storage key */
export const STORAGE_KEYS = {
  settings: 'keyforge:settings',
  history: 'keyforge:history',
} as const
