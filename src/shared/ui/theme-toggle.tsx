import { Moon, Sun, Monitor } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import type { Theme } from '@/shared/types'
import { t } from '@/shared/i18n/zh'

const THEME_ORDER: Theme[] = ['light', 'dark', 'system']

const THEME_ICON: Record<Theme, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
}

const THEME_LABEL: Record<Theme, string> = {
  light: t.themeLight,
  dark: t.themeDark,
  system: t.themeSystem,
}

interface ThemeToggleProps {
  theme: Theme
  onChange: (theme: Theme) => void
}

/**
 * 主题切换按钮：点击在 浅色 → 深色 → 跟随系统 间循环。
 * 图标随当前主题变化，title 显示当前模式。
 */
export function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  const Icon = THEME_ICON[theme]
  const nextIndex = (THEME_ORDER.indexOf(theme) + 1) % THEME_ORDER.length

  return (
    <Button
      variant="ghost"
      size="icon"
      title={THEME_LABEL[theme]}
      onClick={() => onChange(THEME_ORDER[nextIndex])}
    >
      <Icon />
    </Button>
  )
}
