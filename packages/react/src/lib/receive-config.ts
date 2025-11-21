import type { AuthConfig } from "@better-auth-ui/core"

export function receiveConfig(config: AuthConfig) {
  return {
    navigate: (path: string) => {
      window.location.href = path
    },
    replace: (path: string) => {
      window.location.replace(path)
    },
    ...config
  }
}
