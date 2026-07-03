# Key Forge 🔑

Chrome 扩展，本地生成密码学安全的强密码。全本地、零网络请求、零运行时第三方依赖（除 React）。

## 功能

- **随机密码生成**：数字 / 大写 / 小写 / 特殊符号，长度 8–64
- **排除易混淆字符**：剔除 `0 O o 1 l I | ` ' "`
- **自定义排除字符**：手动指定要剔除的字符（应对网站字符限制）
- **历史记录**：本地保存最近 N 条，可逐条删除 / 全清
- **设置持久化**：默认参数、历史容量记忆
- **右键菜单**：网页任意处右键 → "生成强密码并复制"
- **浅/深主题**：跟随系统切换

## 安全

- 密码生成一律使用 `crypto.getRandomValues()` + **拒绝采样**（消除模偏差），严禁 `Math.random()`
- 全本地运行，manifest 不申请任何 host 权限
- 权限最小化：仅 `storage`、`clipboardWrite`、`contextMenus`、`notifications`
- 历史记录仅存 `chrome.storage.local`，不上传

## 技术栈

React 18 + TypeScript + Vite + @crxjs/vite-plugin + Tailwind CSS + shadcn/ui（基于 Radix UI）。

架构采用 Feature-Sliced Design（FSD，单向依赖）：

```
app        → popup / background / manifest
pages      → password / settings（两个用户画面）
widgets    → history-panel（内联折叠区块）
features   → generate-password / copy-result / manage-history / quick-generate
entities   → password / history / settings
shared     → ui / lib / config / types / i18n
```

## 开发与调试

```bash
# 1. 安装依赖
npm install

# 2. 启动开发构建（带 HMR）
npm run dev

# 3. 加载扩展
#    Chrome 打开 chrome://extensions
#    开启右上角「开发者模式」
#    点击「加载已解压」→ 选择项目根目录的 dist/ 文件夹
#    修改代码后扩展自动热重载

# 4. 运行测试
npm test

# 5. 打包生产版本
npm run build
```

## 使用

- **弹窗**：点击工具栏图标 → 配置参数 → 自动生成 → 点击结果框或 📋 复制
- **设置**：点右上角 ⚙ → 调整默认参数 → 点 ← 返回
- **右键**：网页任意处右键 → "生成强密码并复制" → 自动复制并通知

## 项目结构

详见 [PLAN.md](./PLAN.md)。
