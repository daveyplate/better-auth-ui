"use client"

import { viewPaths } from "@better-auth-ui/core"
import type { DeepPartial } from "better-auth/react"
import deepmerge from "deepmerge"
import { useContext } from "react"
import type { AuthConfig } from "../components/auth-provider"
import { AuthContext } from "../components/auth-provider"
import { useHydrated } from "./use-hydrated"

const defaultConfig = {
  basePaths: {
    auth: "/auth",
    account: "/account"
  },
  baseURL: "",
  emailAndPassword: {
    enabled: true,
    forgotPassword: true
  },
  redirectTo: "/",
  viewPaths: viewPaths,
  navigate: (path: string) => {
    window.location.href = path
  },
  replace: (path: string) => window.location.replace(path),
  Link: (props) => <a {...props} />
} satisfies Omit<AuthConfig, "authClient">

export function useAuth(config?: DeepPartial<AuthConfig>) {
  const context = useContext(AuthContext)
  const hydrated = useHydrated()

  const authConfig = deepmerge(
    defaultConfig,
    deepmerge(context || {}, config || {})
  )

  if (authConfig.authClient === undefined) {
    throw new Error("[Better Auth UI] authClient is required")
  }

  authConfig.redirectTo =
    (hydrated &&
      new URLSearchParams(window.location.search).get("redirectTo")) ||
    authConfig.redirectTo

  return authConfig as AuthConfig
}
