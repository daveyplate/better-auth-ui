"use client"

import type {
  AuthConfig as BaseAuthConfig,
  LinkComponent
} from "@better-auth-ui/core"
import {
  type Context,
  createContext,
  type PropsWithChildren,
  type ReactNode,
  useContext
} from "react"

import { receiveConfig } from "../lib/receive-config"
import type { AuthClient } from "../types/auth-client"

export type AuthConfig<TAuthClient extends AuthClient> = Omit<
  BaseAuthConfig,
  "Link"
> & {
  Link: LinkComponent<ReactNode>
  authClient: TAuthClient
}

export const AuthContext: Context<AuthConfig<AuthClient> | undefined> =
  createContext<AuthConfig<AuthClient> | undefined>(undefined)

export type AuthProviderProps<TAuthClient extends AuthClient> =
  PropsWithChildren &
    Omit<Partial<AuthConfig<TAuthClient>>, "authClient"> & {
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
      throw new Error("useAuthConfig: authClient is required")
    }
  }

  return {
    ...configWithoutClient,
    authClient
  } as AuthConfig<AuthClient>
}
