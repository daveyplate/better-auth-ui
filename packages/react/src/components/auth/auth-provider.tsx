import type { AuthConfig as BaseAuthConfig } from "@better-auth-ui/core"
import type { DeepPartial } from "better-auth/client/plugins"
import {
  type ComponentType,
  createContext,
  type PropsWithChildren
} from "react"

import type { AnyAuthClient, AuthClient } from "../../types/auth-client"

/**
 * Extends the base AuthConfig with React-specific requirements including
 * an authClient instance and a Link component for navigation.
 */
export type AuthConfig = BaseAuthConfig & {
  /** Better Auth client instance with all plugins */
  authClient: AuthClient
  /** React component for rendering links */
  Link: ComponentType<PropsWithChildren<{ className?: string; href: string }>>
}

/**
 * Partial AuthConfig with any Better Auth client instance.
 */
export type AnyAuthConfig = DeepPartial<Omit<AuthConfig, "authClient">> & {
  /** Any Better Auth client instance */
  authClient?: AnyAuthClient
}

export const AuthContext = createContext<AnyAuthConfig | undefined>(undefined)

export type AuthProviderProps = PropsWithChildren<AnyAuthConfig> & {
  authClient: AnyAuthClient
}

/**
 * Provides AuthConfig to descendant components.
 */
export function AuthProvider({ children, ...config }: AuthProviderProps) {
  return <AuthContext.Provider value={config}>{children}</AuthContext.Provider>
}
