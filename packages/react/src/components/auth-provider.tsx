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
import type { AnyAuthClient } from "../types/auth-client"

export type AuthConfig<TAuthClient extends AnyAuthClient> = Omit<
  BaseAuthConfig,
  "Link"
> & {
  Link: LinkComponent<ReactNode>
  authClient: TAuthClient
}

export const AuthContext: Context<
  DeepPartial<AuthConfig<AnyAuthClient>> | undefined
> = createContext<DeepPartial<AuthConfig<AnyAuthClient>> | undefined>(undefined)

export type AuthProviderProps<TAuthClient extends AnyAuthClient> =
  PropsWithChildren<
    Omit<DeepPartial<AuthConfig<TAuthClient>>, "authClient"> & {
      authClient: TAuthClient
    }
  >

export function AuthProvider<TAuthClient extends AnyAuthClient>({
  children,
  ...config
}: AuthProviderProps<TAuthClient>) {
  return <AuthContext.Provider value={config}>{children}</AuthContext.Provider>
}
