import { useCallback, useEffect, useState } from 'react'
import type { PasswordConfig } from '@/shared/types'
import { generatePassword } from '@/entities/password'

/**
 * 密码生成器 hook。
 *
 * 维护当前密码配置与生成结果。配置变化时防抖重新生成。
 */
export function usePasswordGenerator(initialConfig: PasswordConfig) {
  const [config, setConfig] = useState<PasswordConfig>(initialConfig)
  const [password, setPassword] = useState<string | null>(null)

  const regenerate = useCallback((cfg: PasswordConfig) => {
    setPassword(generatePassword(cfg))
  }, [])

  const updateConfig = useCallback(
    (patch: Partial<PasswordConfig>) => {
      setConfig((prev) => {
        const next = { ...prev, ...patch }
        setPassword(generatePassword(next))
        return next
      })
    },
    [],
  )

  // 初始化 & 配置变化时立即生成（无防抖需求：操作即点即生成，体感更好）
  useEffect(() => {
    setPassword(generatePassword(config))
    // 仅初始化时执行
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { config, setConfig, password, updateConfig, regenerate }
}
