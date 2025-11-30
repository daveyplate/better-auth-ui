import {
  type AnyAuthConfig,
  deepmerge,
  useAuth as useAuthPrimitive
} from "@better-auth-ui/react"
import { toast } from "sonner"

export function useAuth<TLocalization = Record<string, string>>(
  config?: AnyAuthConfig<TLocalization>
) {
  const extendConfig: AnyAuthConfig<TLocalization> = {
    toast
  }

  return useAuthPrimitive(deepmerge(config, extendConfig))
}
