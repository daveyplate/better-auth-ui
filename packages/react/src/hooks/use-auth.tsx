"use client"

import type { DeepPartial } from "better-auth/client/plugins"
import deepmerge from "deepmerge"
import { useContext } from "react"

import type { AuthConfig } from "../components/auth-provider"
import { AuthContext } from "../components/auth-provider"

const defaultConfig = {
  basePaths: {
    auth: "/auth",
    account: "/account"
  },
  emailAndPassword: {
    enabled: true,
    forgotPassword: true
  },
  navigate: (path: string) => {
    window.location.href = path
  },
  replace: (path: string) => window.location.replace(path),
  Link: (props) => <a {...props} />
} satisfies Omit<AuthConfig, "authClient">

export function receiveConfig(config: DeepPartial<AuthConfig> = {}) {
  if (config.authClient === undefined) {
    throw new Error("[Better Auth UI] authClient is required")
  }

  const merged = deepmerge(defaultConfig, config) as AuthConfig
  // Ensure authClient is typed as AnyAuthClient to avoid type narrowing issues
  return {
    ...merged,
    authClient: merged.authClient as AuthConfig["authClient"]
  }
}

export function useAuth(config?: DeepPartial<AuthConfig>) {
  const context = useContext(AuthContext)
  return receiveConfig(deepmerge(context || {}, config || {}))
}
