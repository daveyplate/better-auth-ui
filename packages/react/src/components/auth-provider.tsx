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
 * @param children - Elements that will be rendered inside the provider.
 * @param config - Partial authentication configuration (DeepPartial<AuthConfig>) with a required `authClient`; this value is supplied to `AuthContext`.
 * @returns The provider element that supplies the given config to its descendants via `AuthContext`.
 */
export function AuthProvider({ children, ...config }: AuthProviderProps) {
  return <AuthContext.Provider value={config}>{children}</AuthContext.Provider>
}