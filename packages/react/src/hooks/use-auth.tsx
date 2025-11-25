"use client"

import type { DeepPartial } from "better-auth/client/plugins"
import deepmerge from "deepmerge"
import { useContext } from "react"

import type { AuthConfig } from "../components/auth-provider"
import { AuthContext } from "../components/auth-provider"
import type { AuthClient } from "../types/auth-client"
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
  navigate: (path: string) => {
    window.location.href = path
  },
  replace: (path: string) => window.location.replace(path),
  Link: (props) => <a {...props} />,
  redirectTo: "/"
} satisfies Omit<AuthConfig, "authClient">

export function useAuth(config?: DeepPartial<AuthConfig>) {
  const context = useContext(AuthContext)
  const authConfig = deepmerge(
    defaultConfig,
    deepmerge(context || {}, config || {})
  )

  if (authConfig.authClient === undefined) {
    throw new Error("[Better Auth UI] authClient is required")
  }

  authConfig.redirectTo =
    (useHydrated() &&
      new URLSearchParams(window.location.search).get("redirectTo")) ||
    authConfig.redirectTo

  return authConfig as AuthConfig & { authClient: AuthClient }
}
