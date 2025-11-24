"use client"

import { useContext } from "react"
import type { AuthConfig } from "../components/auth-provider"
import { AuthContext } from "../components/auth-provider"
import type { AnyAuthClient, AuthClient } from "../types/auth-client"

export function receiveConfig<
  TAuthClient extends AnyAuthClient,
  TConfig extends AuthConfig<TAuthClient>
>(config: Partial<TConfig>) {
  return {
    emailAndPassword: {
      enabled: true
    },
    navigate: (path: string) => {
      window.location.href = path
    },
    replace: (path: string) => window.location.replace(path),
    Link: (props) => <a {...props} />,
    ...config
  } as TConfig
}

export function useAuth(config?: Partial<AuthConfig<AnyAuthClient>>) {
  const context = useContext(AuthContext)

  const merged = {
    ...(config ? receiveConfig(config) : {}),
    ...context,
    ...config
  }

  const { authClient, ...configWithoutClient } = merged

  if (authClient === undefined) {
    if (context) {
      throw new Error("AuthProvider: authClient is required")
    } else {
      throw new Error("useAuth: authClient is required")
    }
  }

  return {
    ...configWithoutClient,
    authClient: authClient as AuthClient
  } as AuthConfig<AuthClient>
}
