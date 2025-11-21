"use client"

import type { AuthConfig } from "@better-auth-ui/core"
import {
  type Context,
  createContext,
  type PropsWithChildren,
  useContext
} from "react"

import { receiveConfig } from "./lib/receive-config"
import type { AuthClient } from "./types/auth-client"

export type AuthConfigWithClient<TAuthClient extends AuthClient> =
  AuthConfig & {
    authClient: TAuthClient
  }

export const AuthContext: Context<
  AuthConfigWithClient<AuthClient> | undefined
> = createContext<AuthConfigWithClient<AuthClient> | undefined>(undefined)

export type AuthProviderProps<TAuthClient extends AuthClient> =
  PropsWithChildren & AuthConfigWithClient<TAuthClient>

export function AuthProvider<TAuthClient extends AuthClient>({
  children,
  authClient,
  ...config
}: AuthProviderProps<TAuthClient>) {
  const authConfig = receiveConfig(config)

  return (
    <AuthContext.Provider value={{ ...authConfig, authClient }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthConfig(
  config?: Partial<AuthConfigWithClient<AuthClient>>
): AuthConfigWithClient<AuthClient> {
  const context = useContext(AuthContext)

  const merged = {
    ...(context ?? {}),
    ...(config ?? {})
  }

  const { authClient, ...configWithoutClient } = merged

  if (authClient === undefined) {
    if (context) {
      throw new Error("AuthProvider: authClient is required")
    } else {
      throw new Error("useAuthConfig: authClient is required")
    }
  }

  return {
    ...receiveConfig(configWithoutClient),
    authClient
  }
}
