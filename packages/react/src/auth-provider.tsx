"use client"

import type { AuthConfig, LinkComponent } from "@better-auth-ui/core"
import {
  type Context,
  createContext,
  type PropsWithChildren,
  type ReactNode,
  useContext
} from "react"

import { receiveConfig } from "./lib/receive-config"
import type { AuthClient } from "./types/auth-client"

export type AuthConfigWithClient<TAuthClient extends AuthClient> = Omit<
  AuthConfig,
  "Link"
> & {
  authClient: TAuthClient
  Link: LinkComponent<ReactNode>
}

export const AuthContext: Context<
  AuthConfigWithClient<AuthClient> | undefined
> = createContext<AuthConfigWithClient<AuthClient> | undefined>(undefined)

export type AuthProviderProps<TAuthClient extends AuthClient> =
  PropsWithChildren &
    Omit<Partial<AuthConfigWithClient<TAuthClient>>, "authClient"> & {
      authClient: TAuthClient
    }

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
    ...(config ? receiveConfig(config) : {}),
    ...context,
    ...config
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
    ...configWithoutClient,
    authClient
  } as AuthConfigWithClient<AuthClient>
}
