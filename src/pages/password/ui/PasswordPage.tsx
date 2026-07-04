import { Copy, RefreshCw, Settings } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Slider } from "@/shared/ui/slider";
import { Switch } from "@/shared/ui/switch";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { cn } from "@/shared/ui/lib/utils";
import type { Settings as SettingsType, Theme } from "@/shared/types";
import { LENGTH_MAX, LENGTH_MIN } from "@/shared/config";
import { t } from "@/shared/i18n/zh";
import { usePasswordGenerator } from "@/features/generate-password";
import { useCopy } from "@/features/copy-result";
import { useHistory } from "@/features/manage-history";
import { HistoryPanel } from "@/widgets/history-panel";

interface PasswordPageProps {
  settings: SettingsType;
  onOpenSettings: () => void;
  onThemeChange: (theme: Theme) => void;
}

export function PasswordPage({
  settings,
  onOpenSettings,
  onThemeChange,
}: PasswordPageProps) {
  const { config, updateConfig, regenerate, password } = usePasswordGenerator(
    settings.password,
  );
  const { copy, copied } = useCopy();
  const history = useHistory(settings.historyLimit);

  const handleRegenerate = () => {
    regenerate(config);
  };

  const handleCopy = () => {
    if (password) {
      copy(password);
      history.add(password);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* 标题栏 */}
      <header className="flex items-center justify-between px-4 py-3">
        <h1 className="flex items-center gap-1.5 text-base font-semibold">
          {t.appName}
        </h1>
        <div className="flex items-center gap-1">
          <ThemeToggle theme={settings.theme} onChange={onThemeChange} />
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenSettings}
            title={t.settings}
          >
            <Settings />
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 px-4 pb-4">
        {/* 长度 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">{t.length}</Label>
            <span className="font-mono text-sm text-muted-foreground">
              {config.length}
            </span>
          </div>
          <Slider
            min={LENGTH_MIN}
            max={LENGTH_MAX}
            step={1}
            value={[config.length]}
            onValueChange={([v]) => updateConfig({ length: v })}
          />
        </div>

        {/* 字符集 */}
        <div className="flex flex-col gap-2.5">
          <Label className="text-sm font-medium">{t.charset}</Label>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            <CharsetCheck
              label={t.digits}
              checked={config.flags.digits}
              onChange={(v) =>
                updateConfig({ flags: { ...config.flags, digits: v } })
              }
            />
            <CharsetCheck
              label={t.uppercase}
              checked={config.flags.uppercase}
              onChange={(v) =>
                updateConfig({ flags: { ...config.flags, uppercase: v } })
              }
            />
            <CharsetCheck
              label={t.lowercase}
              checked={config.flags.lowercase}
              onChange={(v) =>
                updateConfig({ flags: { ...config.flags, lowercase: v } })
              }
            />
            <CharsetCheck
              label={t.symbols}
              checked={config.flags.symbols}
              onChange={(v) =>
                updateConfig({ flags: { ...config.flags, symbols: v } })
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="ambiguous"
              checked={config.excludeAmbiguous}
              onCheckedChange={(v) => updateConfig({ excludeAmbiguous: v })}
            />
            <Label htmlFor="ambiguous" className="text-sm">
              {t.excludeAmbiguous}
            </Label>
          </div>
        </div>

        {/* 自定义排除字符 */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium">{t.excludeChars}</Label>
          <Input
            value={config.excludeChars}
            onChange={(e) => updateConfig({ excludeChars: e.target.value })}
            placeholder={t.excludeCharsPlaceholder}
            className="font-mono text-sm"
          />
        </div>

        {/* 结果框 */}
        <Card
          className={cn(
            "flex items-center gap-2 px-3 py-3",
            !password && "justify-center",
          )}
        >
          {password ? (
            <>
              <code
                className="flex-1 cursor-pointer break-all font-mono text-base"
                onClick={handleCopy}
                title={t.copy}
              >
                {password}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0"
                onClick={handleCopy}
              >
                {copied ? <RefreshCw /> : <Copy />}
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">{t.noCharset}</p>
          )}
        </Card>

        {/* 重新生成 */}
        <Button
          variant="outline"
          onClick={handleRegenerate}
          className="self-end"
        >
          <RefreshCw data-icon="inline-start" />
          {t.regenerate}
        </Button>

        {/* 历史 */}
        <HistoryPanel
          items={history.items}
          onCopy={(v) => copy(v)}
          onRemove={history.remove}
          onClear={history.clear}
        />
      </main>
    </div>
  );
}

/** 字符集复选框（带 label） */
function CharsetCheck({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={checked}
        onCheckedChange={(v) => onChange(v === true)}
      />
      <Label className="cursor-pointer text-sm">{label}</Label>
    </div>
  );
}
