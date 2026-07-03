import { defineManifest } from '@crxjs/vite-plugin'
import pkg from '../../package.json' with { type: 'json' }

export default defineManifest({
  manifest_version: 3,
  name: 'Key Forge',
  version: pkg.version,
  description: '本地生成密码学安全的强密码。全本地、零网络请求。',
  action: {
    default_popup: 'src/app/popup/index.html',
    default_title: 'Key Forge',
    default_icon: {
      '16': 'icons/icon-16.png',
      '32': 'icons/icon-32.png',
      '48': 'icons/icon-48.png',
      '128': 'icons/icon-128.png',
    },
  },
  icons: {
    '16': 'icons/icon-16.png',
    '32': 'icons/icon-32.png',
    '48': 'icons/icon-48.png',
    '128': 'icons/icon-128.png',
  },
  background: {
    service_worker: 'src/app/background/index.ts',
    type: 'module',
  },
  permissions: ['storage', 'clipboardWrite', 'contextMenus', 'notifications'],
})
