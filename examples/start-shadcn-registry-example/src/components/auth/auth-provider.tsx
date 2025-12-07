import type { AnyAuthClient, AuthClient } from "@better-auth-ui/react"
import type { AuthConfig as BaseAuthConfig } from "@better-auth-ui/react/core"
import type { DeepPartial } from "better-auth/client/plugins"
import {
  type ComponentType,
  createContext,
  type PropsWithChildren
} from "react"

/**
 * Extends the base AuthConfig with React-specific requirements including
 * an authClient instance and a Link component for navigation.
 */
export type AuthConfig = BaseAuthConfig & {
  authClient: AuthClient
  /**
   * React component for rendering links
   * @remarks `LinkComponent`
   */
  Link: ComponentType<PropsWithChildren<{ className?: string; href: string }>>
}

/**
 * Partial AuthConfig with any Better Auth client instance.
 */
export type AnyAuthConfig = DeepPartial<Omit<AuthConfig, "authClient">> & {
  /**
   * Better Auth client instance
   * @remarks `AuthClient`
   */
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
