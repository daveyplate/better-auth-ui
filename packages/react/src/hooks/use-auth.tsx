"use client"

import { useContext } from "react"
import type { AuthConfig } from "../components/auth-provider"
import { AuthContext } from "../components/auth-provider"
import { receiveConfig } from "../lib/receive-config"
import type { AuthClient } from "../types/auth-client"

export function useAuth(
  config?: Partial<AuthConfig<AuthClient>>
): AuthConfig<AuthClient> {
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
    authClient
  } as AuthConfig<AuthClient>
}
