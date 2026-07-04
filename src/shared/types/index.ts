/** 字符集标志位 */
export type CharsetFlag = 'digits' | 'uppercase' | 'lowercase' | 'symbols'

/** 密码生成配置 */
export interface PasswordConfig {
  /** 密码长度，8–64 */
  length: number
  /** 各字符集的开关 */
  flags: Record<CharsetFlag, boolean>
  /** 是否排除易混淆字符（0 O o 1 l I | ` ' "） */
  excludeAmbiguous: boolean
  /** 用户自定义要排除的字符 */
  excludeChars: string
}

/** 主题模式 */
export type Theme = 'light' | 'dark' | 'system'

/** 设置（持久化到 chrome.storage.sync） */
export interface Settings {
  /** 密码默认参数 */
  password: PasswordConfig
  /** 历史记录保留条数 */
  historyLimit: number
  /** 主题模式 */
  theme: Theme
}

/** 历史记录项 */
export interface HistoryItem {
  id: string
  value: string
  createdAt: number
}

/** 视图类型（弹窗内切换） */
export type View = 'password' | 'settings'
