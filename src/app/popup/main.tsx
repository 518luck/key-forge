import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "@/app/styles/global.css";
import { Toaster } from "@/shared/ui/sonner";
import { useSettings } from "@/shared/hooks/useSettings";
import { useTheme } from "@/shared/hooks/useTheme";
import { PasswordPage } from "@/pages/password";
import { SettingsPage } from "@/pages/settings";
import { clearHistory } from "@/entities/history";
import type { View } from "@/shared/types";

function App() {
  const { settings, loading, update } = useSettings();
  const [view, setView] = useState<View>("password");

  // 应用主题到 <html>
  useTheme(settings.theme);

  if (loading) {
    return (
      <div className="flex h-[520px] w-[380px] items-center justify-center">
        <p className="text-sm text-muted-foreground">加载中…</p>
      </div>
    );
  }

  return (
    <div className="flex h-[520px] w-[380px] flex-col bg-background">
      {view === "password" ? (
        <PasswordPage
          settings={settings}
          onOpenSettings={() => setView("settings")}
          onThemeChange={(theme) => update({ theme })}
        />
      ) : (
        <SettingsPage
          settings={settings}
          onUpdate={update}
          onBack={() => setView("password")}
          onClearHistory={async () => {
            await clearHistory();
          }}
        />
      )}
      <Toaster position="top-center" richColors />
    </div>
  );
}

const root = document.getElementById("root")!;
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
