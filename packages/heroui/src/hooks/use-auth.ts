import {
  type AnyAuthConfig,
  deepmerge,
  useAuth as useAuthPrimitive
} from "@better-auth-ui/react"
import { toast } from "sonner"

const extendConfig: AnyAuthConfig = {
  toast
}

export function useAuth(config?: AnyAuthConfig) {
  return useAuthPrimitive(deepmerge(extendConfig, config || {}))
}
