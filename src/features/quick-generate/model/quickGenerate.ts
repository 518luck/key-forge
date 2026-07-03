import { generatePassword } from '@/entities/password'
import { getSettings } from '@/entities/settings'
import { addHistoryItem } from '@/entities/history'

/**
 * 快捷生成：读取默认设置 → 生成密码 → 写入历史。
 * 供 Service Worker（右键菜单）复用。返回生成的密码，失败返回 null。
 */
export async function quickGenerate(): Promise<string | null> {
  const settings = await getSettings()
  const password = generatePassword(settings.password)
  if (password) {
    await addHistoryItem(password, settings.historyLimit)
  }
  return password
}
