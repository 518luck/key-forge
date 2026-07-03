import { t } from '@/shared/i18n/zh'

/** 将时间戳格式化为相对时间文案 */
export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)

  if (minutes < 1) return t.justNow
  if (minutes < 60) return t.minutesAgo(minutes)
  if (hours < 24) return t.hoursAgo(hours)
  return t.daysAgo(days)
}
