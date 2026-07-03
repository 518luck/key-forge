import { useState } from 'react'
import { Toaster } from '@/shared/ui/sonner'
import { useSettings } from '@/shared/hooks/useSettings'
import { PasswordPage } from '@/pages/password'
import { SettingsPage } from '@/pages/settings'
import { clearHistory } from '@/entities/history'
import type { View } from '@/shared/types'

export default function App() {
  const { settings, loading, update } = useSettings()
  const [view, setView] = useState<View>('password')

  if (loading) {
    return (
      <div className="flex h-[520px] w-[380px] items-center justify-center">
        <p className="text-sm text-muted-foreground">加载中…</p>
      </div>
    )
  }

  return (
    <div className="flex h-[520px] w-[380px] flex-col bg-background">
      {view === 'password' ? (
        <PasswordPage settings={settings} onOpenSettings={() => setView('settings')} />
      ) : (
        <SettingsPage
          settings={settings}
          onUpdate={update}
          onBack={() => setView('password')}
          onClearHistory={async () => {
            await clearHistory()
          }}
        />
      )}
      <Toaster position="top-center" richColors />
    </div>
  )
}
