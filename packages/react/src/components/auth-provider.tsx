"use client"

import type {
  AuthConfig as BaseAuthConfig,
  LinkComponent
} from "@better-auth-ui/core"
import type { DeepPartial } from "better-auth/client/plugins"
import { createContext, type PropsWithChildren, type ReactNode } from "react"
import type { AnyAuthClient } from "../types/auth-client"

export type AuthConfig = Omit<BaseAuthConfig, "Link"> & {
  Link: LinkComponent<ReactNode>
  authClient: AnyAuthClient
}

export const AuthContext = createContext<DeepPartial<AuthConfig>>({})

export type AuthProviderProps = PropsWithChildren<
  Omit<DeepPartial<AuthConfig>, "authClient"> & {
    authClient: AnyAuthClient
  }
>

export function AuthProvider({ children, ...config }: AuthProviderProps) {
  return <AuthContext.Provider value={config}>{children}</AuthContext.Provider>
}
