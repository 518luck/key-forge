/**
 * 打包扩展为 Chrome Web Store 上传用的 ZIP。
 *
 * 关键要求：manifest.json 必须在 ZIP 的根目录（不能套一层文件夹）。
 * 因此进入 dist/ 目录再打包其全部内容。
 */
const { existsSync, mkdirSync } = require('node:fs')
const { resolve } = require('node:path')
const { execSync } = require('node:child_process')

const root = resolve(__dirname, '..')
const distDir = resolve(root, 'dist')
const outDir = resolve(root, 'release')
const version = require('../package.json').version
const outFile = resolve(outDir, `keyforge-v${version}.zip`)

if (!existsSync(distDir)) {
  console.error('错误：dist/ 不存在，请先运行 npm run build')
  process.exit(1)
}

if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true })
}

// 先清掉可能存在的旧文件
try {
  require('node:fs').unlinkSync(outFile)
} catch {
  // 不存在则忽略
}

// 进入 dist 打包其内容（不含 dist 目录本身），保留内部结构
// -r 递归，-X 不存额外文件属性（更干净），-q 安静
execSync(`zip -r -X -q "${outFile}" .`, { cwd: distDir, stdio: 'inherit' })

console.log(`\n✓ 打包完成：${outFile}`)
console.log(`  manifest.json 位于 ZIP 根目录，可直接上传 Chrome Web Store`)
