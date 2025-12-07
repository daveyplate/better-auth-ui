import {
  type AnyAuthConfig,
  useAuth as useAuthPrimitive
} from "@better-auth-ui/react"
import { deepmerge } from "@better-auth-ui/react/core"
import { toast } from "sonner"

export function useAuth(config?: AnyAuthConfig) {
  const extendConfig: AnyAuthConfig = {
    toast
  }

  return useAuthPrimitive(deepmerge(extendConfig, config || {}))
}
