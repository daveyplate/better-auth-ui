"use client"

import type {
  AuthConfig as BaseAuthConfig,
  LinkComponent
} from "@better-auth-ui/core"
import type { DeepPartial } from "better-auth/client/plugins"
import {
  type Context,
  createContext,
  type PropsWithChildren,
  type ReactNode
} from "react"
import { receiveConfig } from "../hooks/use-auth"
import type { AnyAuthClient } from "../types/auth-client"

export type AuthConfig<TAuthClient extends AnyAuthClient> = Omit<
  BaseAuthConfig,
  "Link"
> & {
  Link: LinkComponent<ReactNode>
  authClient: TAuthClient
}

export const AuthContext: Context<AuthConfig<AnyAuthClient> | undefined> =
  createContext<AuthConfig<AnyAuthClient> | undefined>(undefined)

export type AuthProviderProps<TAuthClient extends AnyAuthClient> =
  PropsWithChildren &
    Omit<DeepPartial<AuthConfig<TAuthClient>>, "authClient"> & {
      authClient: TAuthClient
    }

export function AuthProvider<TAuthClient extends AnyAuthClient>({
  children,
  ...config
}: AuthProviderProps<TAuthClient>) {
  const authConfig = receiveConfig(config)

  return (
    <AuthContext.Provider value={{ ...authConfig }}>
      {children}
    </AuthContext.Provider>
  )
}
