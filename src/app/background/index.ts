import { quickGenerate } from '@/features/quick-generate'
import { t } from '@/shared/i18n/zh'

/** 右键菜单 ID */
const MENU_ID = 'keyforge-generate'

/**
 * 注册右键菜单（安装时触发一次）。
 */
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: `🔑 ${t.contextGenerate}`,
    contexts: ['all'],
  })
})

/**
 * 右键菜单点击：生成密码 → 复制到剪贴板 → 系统通知。
 * 历史记录已在 quickGenerate 内写入。
 */
chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId !== MENU_ID) return

  const password = await quickGenerate()
  if (!password) {
    notify(t.noCharset)
    return
  }

  // MV3 Service Worker 中 navigator.clipboard 在 clipboardWrite 权限下可用
  try {
    await navigator.clipboard.writeText(password)
    notify(t.notifCopied)
  } catch {
    notify('复制失败，请重试')
  }
})

function notify(message: string): void {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-128.png',
    title: t.appName,
    message,
  })
}
