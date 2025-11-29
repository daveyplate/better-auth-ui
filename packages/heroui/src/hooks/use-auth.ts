import {
  type AuthConfig,
  deepmerge,
  useAuth as useAuthPrimitive
} from "@better-auth-ui/react"
import type { DeepPartial } from "better-auth/react"
import { toast } from "sonner"

export function useAuth(config?: DeepPartial<AuthConfig>) {
  const extendConfig: Partial<AuthConfig> = {
    toast
  }

  return useAuthPrimitive(deepmerge(config, extendConfig))
}
