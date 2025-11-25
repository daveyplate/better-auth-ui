"use client"

import type { AuthConfig as BaseAuthConfig } from "@better-auth-ui/core"
import type { DeepPartial } from "better-auth/client/plugins"
import {
  type ComponentPropsWithRef,
  type ComponentType,
  createContext,
  type PropsWithChildren
} from "react"

import type { AnyAuthClient } from "../types/auth-client"

export type AuthConfig = Omit<BaseAuthConfig, "Link"> & {
  Link: ComponentType<ComponentPropsWithRef<"a">>
  authClient: AnyAuthClient
}

export const AuthContext = createContext<DeepPartial<AuthConfig> | undefined>(
  undefined
)

export type AuthProviderProps = PropsWithChildren<
  DeepPartial<AuthConfig> & {
    authClient: AnyAuthClient
  }
>

export function AuthProvider({ children, ...config }: AuthProviderProps) {
  return <AuthContext.Provider value={config}>{children}</AuthContext.Provider>
}
