import {
  type AuthConfig,
  deepmerge,
  useAuth as useAuthPrimitive
} from "@better-auth-ui/react"
import type { DeepPartial } from "better-auth/react"
import { toast } from "sonner"

export function useAuth(config?: DeepPartial<AuthConfig>) {
  const extendConfig: Partial<AuthConfig> = {
    toast: ({ message, type, action }) => {
      switch (type) {
        case "success":
          toast.success(message, { action })
          break
        case "error":
          toast.error(message, { action })
          break
        default:
          toast(message, { action })
          break
      }
    }
  }

  return useAuthPrimitive(deepmerge(config, extendConfig))
}
