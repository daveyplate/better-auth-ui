"use client"

import type { DeepPartial } from "better-auth/client/plugins"
import deepmerge from "deepmerge"
import { useContext } from "react"

import type { AuthConfig } from "../components/auth-provider"
import { AuthContext } from "../components/auth-provider"
import type { AnyAuthClient, AuthClient } from "../types/auth-client"

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
} satisfies Omit<AuthConfig<AuthClient>, "authClient">

export function receiveConfig(
  config: DeepPartial<AuthConfig<AnyAuthClient>> = {}
) {
  if (config.authClient === undefined) {
    throw new Error("[Better Auth UI] authClient is required")
  }

  return deepmerge(defaultConfig, config) as AuthConfig<AuthClient>
}

export function useAuth(config?: DeepPartial<AuthConfig<AnyAuthClient>>) {
  const context = useContext(AuthContext)
  return receiveConfig(deepmerge(context || {}, config || {}))
}
