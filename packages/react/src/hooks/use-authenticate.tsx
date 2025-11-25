"use client"

import type { DeepPartial } from "better-auth/client/plugins"
import { useEffect } from "react"

import type { AuthConfig } from "../components/auth-provider"
import type { AnyAuthClient } from "../types/auth-client"
import { useAuth } from "./use-auth"

export function useAuthenticate<TAuthClient extends AnyAuthClient>(
  config?: DeepPartial<AuthConfig & { authClient?: TAuthClient }>
) {
  const { authClient, replace, basePaths } = useAuth(config)
  const typedAuthClient = authClient as TAuthClient
  const { data, isPending, ...rest } = typedAuthClient.useSession()

  useEffect(() => {
    if (isPending) return

    if (!data) {
      const currentUrl =
        window.location.pathname + window.location.search + window.location.hash
      const redirectTo = encodeURIComponent(currentUrl)
      const signInPath = `${basePaths.auth}/sign-in?redirectTo=${redirectTo}`
      replace(signInPath)
    }
  }, [data, isPending, replace, basePaths.auth])

  return { data, isPending, ...rest }
}
