import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { copyToClipboard } from '@/shared/lib/clipboard'
import { t } from '@/shared/i18n/zh'

/**
 * 复制结果 hook：复制到剪贴板并弹出 Toast。
 * 返回 { copy, copied } —— copied 用于按钮短暂变 ✓。
 */
export function useCopy() {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text: string) => {
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopied(true)
      toast.success(t.copied)
      setTimeout(() => setCopied(false), 1500)
    } else {
      toast.error('复制失败')
    }
  }, [])

  return { copy, copied }
}
