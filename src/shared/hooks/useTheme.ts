import { useEffect } from 'react'
import type { Theme } from '@/shared/types'

/**
 * 主题应用 hook。
 *
 * 将 theme 值同步到 <html> 的 class：
 * - light: 移除 .dark
 * - dark:  添加 .dark
 * - system: 跟随 prefers-color-scheme，并实时监听变化
 */
export function useTheme(theme: Theme) {
  useEffect(() => {
    const root = document.documentElement

    const apply = (mode: Theme) => {
      const isDark =
        mode === 'dark' ||
        (mode === 'system' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      root.classList.toggle('dark', isDark)
    }

    apply(theme)

    // 仅 system 模式需要监听系统主题变化
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => apply('system')
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [theme])
}
