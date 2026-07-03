# Key Forge — 实施计划

Chrome 扩展，本地生成密码学安全的强密码。全本地、零网络请求、零运行时第三方依赖。

---

## 0. 概述

Key Forge 是一个 Chrome 浏览器扩展（Manifest V3），为用户提供**密码学安全的强密码**生成能力。所有生成、存储均在本地完成，不上传任何数据，强调隐私与安全。

- **技术栈**：React 18 + TypeScript + Vite + `@crxjs/vite-plugin` + Tailwind CSS + shadcn/ui（基于 Radix UI）
- **界面语言**：简体中文为主
- **架构**：Feature-Sliced Design（FSD，单向依赖）

---

## 1. 功能清单

| 模块           | 说明              | 规则                                                                          |
| -------------- | ----------------- | ----------------------------------------------------------------------------- |
| 随机密码       | 字符集勾选 + 长度 | 数字 / 大写 / 小写 / 特殊符号；长度 8–64；`crypto.getRandomValues` + 拒绝采样 |
| 排除易混淆字符 | 开关              | 剔除 `0 O o 1 l I \| ` ' "`                                                   |
| 自定义排除字符 | 输入框            | 手动输入要剔除的字符（如某些网站禁止 `"` `<` 空格等）                         |
| 历史记录       | 本地              | `chrome.storage.local`，默认 20 条，可逐条删 / 全清                           |
| 设置持久化     | 本地              | `chrome.storage.sync`                                                         |
| 复制           | 一键              | `navigator.clipboard`，复制后 Toast 反馈                                      |
| 右键菜单       | 快捷              | Service Worker 注册 `contextMenus`，生成 → 复制 → 入历史 → 通知               |
| 设置视图       | 偏好              | 弹窗内 ⚙ 按钮切换进入；默认参数、历史容量管理                                 |

---

## 2. 业务流程

- **弹窗主流程**：图标 → 弹窗（默认即密码生成视图）→ 调参 → 实时生成 → 复制 / 重生成 / 历史
- **设置流程**：点 ⚙ → 切换到设置视图 → 改默认值 → `chrome.storage.sync` 持久化 → 点 ← 返回主视图
- **右键流程**：网页右键 → "生成强密码并复制" → 后台用默认参数生成 → 写入剪贴板 → 入历史 → 通知反馈

---

## 3. UI 设计（紧凑实用型）

### 3.1 设计规范

- 弹窗尺寸：**380 × 520 px**，无滚动（历史折叠展开时内部滚动）
- 圆角：卡片 12px，按钮 8px，结果框 8px
- 主色 `#6366f1`（靛蓝）；浅色背景 `#ffffff` / 深色 `#1a1a2e`
- 跟随系统 `prefers-color-scheme` 切换浅/深主题（Tailwind dark: 变体 + CSS 变量）
- 字体：系统默认 `-apple-system, system-ui`

### 3.2 弹窗 - 主视图（密码生成）

```
╭─ 🔑 Key Forge ───────────── ⚙ ─╮  ← 标题栏，⚙ 进入设置视图
│                                │
│  长度  ━━━━━━●━━━━━ 16         │  ← 滑块 8–64
│  字符  [✓]数字  [✓]大写        │  ← 复选框 2×2
│        [✓]小写  [✓]特殊符号    │
│        [ ] 排除易混淆字符       │  ← 单行开关
│  排除  ┌──────────────┐        │
│        │ "< 空格...      │     │  ← 自定义排除字符输入框
│                                │
│  ┌────────────────────────┐    │
│  │ K9#m@xL2!vQ&8nZ       │ 📋 │  ← 结果框（等宽字体）+ 复制按钮
│  └────────────────────────┘    │
│                      ↻ 重新生成│  ← 次要按钮
│                                │
│  ▸ 历史记录 (5)                │  ← 折叠（展开见 3.4）
╰────────────────────────────────╯
```

### 3.3 弹窗 - 设置视图（点 ⚙ 切换，左上 ← 返回）

```
╭─ ← 设置 ──────────────────────╮
│                                │
│ ╭ 默认参数 ╮                   │
│ 默认长度       ━━━━━━●━━━━━ 16 │
│ 默认字符集     [✓]数字 [✓]大写 │
│               [✓]小写 [✓]符号  │
│ 排除易混淆字符   [ 开启 ]       │
│ 默认排除字符   ┌────────────┐  │
│               │ "< 空格...   │  │
│                                │
│ ╭ 历史 ╮                       │
│ 保留条数       ━━━━●━━━━ 20    │
│ [ 清空全部历史 ]               │
│                                │
│ ╭ 关于 ╮                       │
│ Key Forge v1.0 · 全本地        │
│ · 零网络请求                   │
╰────────────────────────────────╯
```

### 3.4 历史记录展开

```
  ▾ 历史记录 (5)
  ┌─────────────────────────────┐
  │ K9#m@xL2!vQ&8nZ    📋  ✕   │  刚刚
  ├─────────────────────────────┤
  │ xP9!mK2#vQ&8nZ     📋  ✕   │  2 分钟前
  └─────────────────────────────┘
```

### 3.5 右键菜单 + 通知

```
网页右键：                        生成后通知：
┌────────────────────┐           ┌────────────────────┐
│ 🔑 生成强密码并复制 │   →       │ 🔑 Key Forge       │
└────────────────────┘           │ 已复制到剪贴板      │
                                 └────────────────────┘
```

### 3.6 交互细节

- 参数变动立即重新生成（防抖 150ms）
- 复制成功：按钮短暂变 ✓ + 1.5s Toast "已复制"
- 结果区点击 = 复制；等宽字体显示
- 历史默认折叠，点击展开；最新在上
- 弹窗打开即用默认设置生成一条
- ⚙ 与 ← 为视图切换，不打开新窗口

---

## 4. 技术栈

| 项         | 选型                                                       |
| ---------- | ---------------------------------------------------------- |
| 框架       | React 18 + TypeScript                                      |
| 构建       | Vite + `@crxjs/vite-plugin`（自动处理 Manifest V3、HMR）   |
| 状态       | React hooks + `chrome.storage`（轻量，无需 Redux/Zustand） |
| 样式       | Tailwind CSS（CSS 变量实现浅/深主题）                      |
| 组件       | shadcn/ui（基于 Radix UI 源码内联到项目，非 npm 依赖）     |
| 测试       | Vitest（核心纯函数：random、generator）                    |
| 运行时依赖 | react、react-dom、Radix UI 原语、lucide-react、cva、clsx、tailwind-merge |

> shadcn/ui 的组件源码通过 CLI 复制进 `src/shared/ui`，按需引入；底层 Radix 原语（@radix-ui/react-*）作为 npm 依赖。

---

## 5. FSD 架构（单向依赖 shared → entities → features → widgets → pages → app）

每层只能引用更下层，保证单向依赖、可独立测试。

### 5.1 层级 → 职责映射

| 层           | 职责                                     | 本项目切片                                                                         |
| ------------ | ---------------------------------------- | ---------------------------------------------------------------------------------- |
| **app**      | 应用入口、全局样式、manifest、background | popup / background / manifest                                                      |
| **pages**    | 页面级组装（对应用户画面）               | password / settings                                                                |
| **widgets**  | 业务组合块                               | history-panel                                                                      |
| **features** | 用户交互/场景                            | generate-password / copy-result / manage-history / quick-generate                 |
| **entities** | 业务实体与领域逻辑                       | password / history / settings                                                     |
| **shared**   | 基础设施（无业务）                       | ui / lib / config / types / i18n                                                   |

每个切片内部按 segment 组织：`ui`（组件）、`model`（状态/业务模型）、`lib`（工具）、`api`（外部交互）、`config`、`i18n`。

### 5.2 完整目录结构

```
key-forge/
├── public/icons/                         # 扩展图标 16/32/48/128
├── src/
│   ├── app/                              # 应用层（根）
│   │   ├── manifest.ts                   # Manifest V3 配置
│   │   ├── background/index.ts           # Service Worker: 右键菜单 + 通知
│   │   ├── popup/{index.html, main.tsx}
│   │   └── styles/global.css             # Tailwind 入口 + 主题变量(浅/深)
│   │
│   ├── pages/                            # 页面组装（对应用户画面）
│   │   ├── password/ui/PasswordPage.tsx   # 密码生成视图
│   │   └── settings/ui/SettingsPage.tsx   # 设置视图
│   │
│   ├── widgets/                          # 业务组合块
│   │   └── history-panel/{ui, model}     # 历史记录折叠区块（内联于密码视图）
│   │
│   ├── features/                         # 用户场景
│   │   ├── generate-password/{ui, model, lib}
│   │   ├── copy-result/{ui, model}       # 复制 + Toast
│   │   ├── manage-history/{ui, model}    # 增删清空
│   │   └── quick-generate/{model}        # 右键快速生成逻辑
│   │
│   ├── entities/                         # 业务实体
│   │   ├── password/{model: charset + generator, config}
│   │   ├── history/{model: entity, api: storage.local}
│   │   └── settings/{model: entity, api: storage.sync}
│   │
│   └── shared/                           # 基础设施（无业务，叶子）
│       ├── ui/                           # shadcn/ui 组件源码（内联）
│       │   ├── button.tsx, card.tsx, slider.tsx, switch.tsx
│       │   ├── checkbox.tsx, select.tsx, toast.tsx, sonner.tsx(Toast)
│       │   └── lib/utils.ts              # cn() 合并 class
│       ├── lib/{random.ts, clipboard.ts} # crypto + 拒绝采样 / clipboard
│       ├── config/{limits.ts}            # 长度范围 / 默认值
│       ├── types/index.ts                # PasswordConfig, HistoryItem, Settings...
│       └── i18n/zh.ts
│
├── components.json                       # shadcn/ui 配置
├── tailwind.config.ts                    # Tailwind 配置 + 主题色
├── postcss.config.js
├── vite.config.ts                        # @crxjs/vite-plugin + HMR
├── tsconfig.json                         # 含 @/* 路径别名
├── package.json
└── README.md
```

### 5.3 依赖方向示例（体现 FSD 单向依赖）

```
popup 入口（app/popup）
  → pages/password, pages/settings          # 两个用户画面
      → widgets/history-panel               # 历史内联于密码视图
      → features/generate-password, copy-result
          → entities/password, history, settings
              → shared/lib(random), shared/config, shared/types

说明：app/popup 的 main.tsx 维护 view: 'password' | 'settings' 状态，渲染对应 page；
history-panel 作为内联折叠区块嵌在 password 页内，故属 widgets 而非 pages。
```

`shared` 永远是叶子，`app` 永远是根。跨层禁止反向引用。

---

## 6. 核心数据模型（shared/types）

```ts
type CharsetFlag = "digits" | "uppercase" | "lowercase" | "symbols";

interface PasswordConfig {
  length: number;
  flags: Record<CharsetFlag, boolean>;
  excludeAmbiguous: boolean;
  excludeChars: string; // 自定义排除字符，如 '"< 或空格
}

interface Settings {
  password: PasswordConfig;
  historyLimit: number;
}

interface HistoryItem {
  id: string;
  value: string;
  createdAt: number;
}
```

---

## 7. 关键实现

- **`shared/lib/random.ts`**：`getRandomInt(max)` 用 `crypto.getRandomValues` + 拒绝采样（丢弃 `>= 2^floor` 取值范围的字节），消除模偏差；`shuffle` 同理。
- **`entities/password`**：字符集按 flags 组合；`excludeAmbiguous` 剔除 `0 O o 1 l I | ` ' "`；`excludeChars` 再从集合中剔除用户自定义字符。三者叠加得到最终字符集，若结果为空则给出提示而非生成。
- **`entities/history`、`entities/settings`**：api 层封装 `chrome.storage.local` / `sync`，model 层提供 CRUD。
- **`features`**：`copy-result` 用 `navigator.clipboard`；`quick-generate` 供 background 复用。
- **`pages/popup`**：维护 `view: 'generate' | 'settings'` 状态，按 ⚙ / ← 切换，渲染对应 widget。
- **字符集为空的边界处理**：当 flags 全未勾选、或排除后字符集为空时，结果区显示"请至少选择一种字符集"，不调用生成器。

---

## 8. 权限（manifest）

仅申请：`storage`、`clipboardWrite`、`contextMenus`、`notifications`。**不申请任何 host 权限**。

---

## 9. 实施步骤

1. **脚手架与配置**
   - `package.json` + 依赖安装（react、react-dom、@crxjs/vite-plugin、@types/chrome、typescript、@vitejs/plugin-react、vite、vitest）
   - Tailwind CSS：`tailwind.config.ts`、`postcss.config.js`、`@/styles/global.css`（Tailwind 指令 + CSS 变量主题）
   - shadcn/ui：`components.json` 初始化，别名指向 `@/shared/ui`
   - `vite.config.ts`（@crxjs + HMR）、`tsconfig.json`（`@/*` 别名指向 src）
   - `app/manifest.ts`（MV3：popup / background + 最小权限）
   - 占位图标（SVG → 多尺寸）

2. **shared 层**
   - `types`、`config`、`i18n/zh.ts`
   - `lib/random.ts`（安全随机 + 拒绝采样）、`lib/clipboard.ts`
   - `ui`：用 shadcn CLI 按需生成（button / card / slider / switch / checkbox / select / sonner 或 toast），源码内联到 `@/shared/ui`

3. **entities 层**
   - `password`（字符集 + 生成器）
   - `history`、`settings`（storage api 封装）

4. **features 层**
   - generate-password / copy-result / manage-history / quick-generate

5. **widgets 层**
   - history-panel（历史折叠区块）

6. **pages + app 层**
   - `pages/password`、`pages/settings`（两个用户画面）
   - `app/popup` 入口（维护 view 切换）；`app/background` Service Worker（右键菜单 + 通知）；`app/manifest`；`global.css`

7. **测试**（Vitest）
   - 覆盖 random（分布均匀性）、generator、charset 过滤（含自定义排除）

8. **文档**
   - `README.md`（开发调试与打包说明）

---

## 10. 验收标准

- `npm run dev` → `chrome://extensions` 加载 dist → 弹窗可用
- 密码生成、复制、历史、设置持久化、右键菜单 + 通知全部正常
- ⚙ 视图切换流畅（不弹新窗口）
- 浅/深主题正确切换
- 核心纯函数测试通过

---

## 11. 开发与调试流程

1. `npm install`
2. `npm run dev`（@crxjs 启动带 HMR 的开发构建）
3. Chrome 打开 `chrome://extensions` → 开启"开发者模式" → "加载已解压" → 选 `dist/` 目录
4. 改代码后扩展自动热重载，无需手动刷新
5. `npm run build` 打包生产版本

---

## 12. 安全与隐私原则（贯穿全局）

- 严禁 `Math.random()`，统一用 `crypto.getRandomValues()` + 拒绝采样
- 全本地、零网络请求（manifest 不申请任何 host 权限）
- 权限最小化：仅 `storage`、`clipboardWrite`、`contextMenus`、`notifications`
- 历史记录仅存 `chrome.storage.local`，不上传
