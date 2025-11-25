"use client"

import deepmerge from "deepmerge"
import { useContext } from "react"
import type { AuthConfig } from "../components/auth-provider"
import { AuthContext } from "../components/auth-provider"
import type { AnyAuthClient, AuthClient } from "../types/auth-client"

const defaultConfig = {
  emailAndPassword: {
    enabled: true,
    forgotPassword: true
  },
  navigate: (path: string) => {
    window.location.href = path
  },
  replace: (path: string) => window.location.replace(path),
  Link: (props) => <a {...props} />
} satisfies Partial<AuthConfig<AnyAuthClient>>

export function receiveConfig(config: Partial<AuthConfig<AnyAuthClient>> = {}) {
  return deepmerge(defaultConfig, config) as AuthConfig<AuthClient>
}

export function useAuth(config?: Partial<AuthConfig<AnyAuthClient>>) {
  const context = useContext(AuthContext)

  const mergedConfig = receiveConfig(deepmerge(context || {}, config || {}))
  const { authClient, ...rest } = mergedConfig

  if (authClient === undefined) {
    if (context) {
      throw new Error("AuthProvider: authClient is required")
    } else {
      throw new Error("useAuth: authClient is required")
    }
  }

  return {
    authClient,
    ...rest
  }
}
