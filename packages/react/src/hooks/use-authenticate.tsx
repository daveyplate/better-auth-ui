"use client"

import type { DeepPartial } from "better-auth/client/plugins"
import { useEffect } from "react"

import type { AuthConfig } from "../components/auth-provider"
import type { AnyAuthClient } from "../types/auth-client"
import { useAuth } from "./use-auth"

export function useAuthenticate<TAuthClient extends AnyAuthClient>(
  config?: DeepPartial<AuthConfig & { authClient?: TAuthClient }>
) {
  const { authClient, basePaths, replace, viewPaths } = useAuth(config)
  const { data, isPending, ...rest } = (authClient as TAuthClient).useSession()

  useEffect(() => {
    if (data || isPending) return

    const currentURL = window.location.pathname + window.location.search
    const redirectTo = encodeURIComponent(currentURL)
    const signInPath = `${basePaths.auth}/${viewPaths.auth.signIn}?redirectTo=${redirectTo}`

    replace(signInPath)
  }, [basePaths.auth, data, isPending, replace, viewPaths.auth.signIn])

  return { data, isPending, ...rest }
}
