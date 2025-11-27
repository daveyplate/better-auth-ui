"use client"

import type { AuthConfig as BaseAuthConfig } from "@better-auth-ui/core"
import type { DeepPartial } from "better-auth/client/plugins"
import {
  type ComponentPropsWithRef,
  type ComponentType,
  createContext,
  type PropsWithChildren
} from "react"

import type { AnyAuthClient, AuthClient } from "../types/auth-client"

export type AuthConfig = BaseAuthConfig & {
  Link: ComponentType<ComponentPropsWithRef<"a"> & { href: string }>
  authClient: AuthClient
}

type AuthProviderConfig = DeepPartial<AuthConfig> & {
  authClient: AnyAuthClient
}

export const AuthContext = createContext<AuthProviderConfig | undefined>(
  undefined
)

export type AuthProviderProps = PropsWithChildren<AuthProviderConfig>

/**
 * Provides authentication configuration to descendant components via AuthContext.
 *
 * @param children - Elements rendered inside the provider.
 * @param config - Authentication provider configuration; must include an `authClient`.
 * @returns The AuthContext.Provider element that supplies the given config to its descendants.
 */
export function AuthProvider({ children, ...config }: AuthProviderProps) {
  return <AuthContext.Provider value={config}>{children}</AuthContext.Provider>
}
