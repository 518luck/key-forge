import { ArrowLeft, Trash2 } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Slider } from '@/shared/ui/slider'
import { Switch } from '@/shared/ui/switch'
import { Checkbox } from '@/shared/ui/checkbox'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Separator } from '@/shared/ui/separator'
import { ThemeToggle } from '@/shared/ui/theme-toggle'
import type { Settings as SettingsType } from '@/shared/types'
import {
  HISTORY_LIMIT_MAX,
  HISTORY_LIMIT_MIN,
  LENGTH_MAX,
  LENGTH_MIN,
} from '@/shared/config'
import { t } from '@/shared/i18n/zh'

interface SettingsPageProps {
  settings: SettingsType
  onUpdate: (patch: Partial<SettingsType>) => void
  onBack: () => void
  onClearHistory: () => void
}

export function SettingsPage({
  settings,
  onUpdate,
  onBack,
  onClearHistory,
}: SettingsPageProps) {
  const pwd = settings.password

  return (
    <div className="flex h-full flex-col">
      {/* 标题栏 */}
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack} title={t.back}>
            <ArrowLeft />
          </Button>
          <h1 className="text-base font-semibold">{t.settings}</h1>
        </div>
        <ThemeToggle
          theme={settings.theme}
          onChange={(theme) => onUpdate({ theme })}
        />
      </header>

      <main className="flex flex-1 flex-col gap-4 px-4 pb-4">
        {/* 默认参数 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t.defaultParams}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {/* 默认长度 */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">{t.defaultLength}</Label>
                <span className="font-mono text-sm text-muted-foreground">
                  {pwd.length}
                </span>
              </div>
              <Slider
                min={LENGTH_MIN}
                max={LENGTH_MAX}
                step={1}
                value={[pwd.length]}
                onValueChange={([v]) =>
                  onUpdate({ password: { ...pwd, length: v } })
                }
              />
            </div>

            <Separator />

            {/* 默认字符集 */}
            <div className="flex flex-col gap-2.5">
              <Label className="text-sm">{t.defaultCharset}</Label>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                <SettingCheck
                  label={t.digits}
                  checked={pwd.flags.digits}
                  onChange={(v) =>
                    onUpdate({ password: { ...pwd, flags: { ...pwd.flags, digits: v } } })
                  }
                />
                <SettingCheck
                  label={t.uppercase}
                  checked={pwd.flags.uppercase}
                  onChange={(v) =>
                    onUpdate({ password: { ...pwd, flags: { ...pwd.flags, uppercase: v } } })
                  }
                />
                <SettingCheck
                  label={t.lowercase}
                  checked={pwd.flags.lowercase}
                  onChange={(v) =>
                    onUpdate({ password: { ...pwd, flags: { ...pwd.flags, lowercase: v } } })
                  }
                />
                <SettingCheck
                  label={t.symbols}
                  checked={pwd.flags.symbols}
                  onChange={(v) =>
                    onUpdate({ password: { ...pwd, flags: { ...pwd.flags, symbols: v } } })
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="set-ambiguous"
                  checked={pwd.excludeAmbiguous}
                  onCheckedChange={(v) =>
                    onUpdate({ password: { ...pwd, excludeAmbiguous: v } })
                  }
                />
                <Label htmlFor="set-ambiguous" className="text-sm">
                  {t.excludeAmbiguous}
                </Label>
              </div>
            </div>

            <Separator />

            {/* 默认排除字符 */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">{t.defaultExcludeChars}</Label>
              <Input
                value={pwd.excludeChars}
                onChange={(e) =>
                  onUpdate({ password: { ...pwd, excludeChars: e.target.value } })
                }
                placeholder={t.excludeCharsPlaceholder}
                className="font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* 历史 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t.passphraseSection}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">{t.historyLimit}</Label>
                <span className="font-mono text-sm text-muted-foreground">
                  {settings.historyLimit}
                </span>
              </div>
              <Slider
                min={HISTORY_LIMIT_MIN}
                max={HISTORY_LIMIT_MAX}
                step={5}
                value={[settings.historyLimit]}
                onValueChange={([v]) => onUpdate({ historyLimit: v })}
              />
            </div>
            <Button variant="outline" onClick={onClearHistory}>
              <Trash2 data-icon="inline-start" />
              {t.clearHistory}
            </Button>
          </CardContent>
        </Card>

        {/* 关于 */}
        <Card>
          <CardContent className="py-4">
            <p className="text-center text-xs text-muted-foreground">{t.aboutText}</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function SettingCheck({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(v === true)} />
      <Label className="cursor-pointer text-sm">{label}</Label>
    </div>
  )
}
