import type { AuthConfig as BaseAuthConfig } from "@better-auth-ui/core"
import type { DeepPartial } from "better-auth/client/plugins"
import {
  type ComponentType,
  createContext,
  type PropsWithChildren
} from "react"

import type { AnyAuthClient, AuthClient } from "../../types/auth-client"

/**
 * Extended authentication configuration for React components.
 *
 * Extends the base AuthConfig with React-specific requirements including
 * a Link component for navigation and an authClient instance.
 */
export type AuthConfig<TLocalization = Record<string, string>> =
  BaseAuthConfig<TLocalization> & {
    /** React component for rendering links (e.g., Next.js Link, React Router Link) */
    Link: ComponentType<PropsWithChildren<{ className?: string; href: string }>>
    /** Authenticated auth client instance */
    authClient: AuthClient
  }

export type AnyAuthConfig<TLocalization = Record<string, string>> = DeepPartial<
  Omit<AuthConfig<TLocalization>, "authClient">
> & {
  authClient?: AnyAuthClient
}

/**
 * React context that provides authentication configuration to descendant components.
 *
 * Components can access the auth configuration using `useContext(AuthContext)` or
 * through the `useAuth` hook which wraps this context.
 */
export const AuthContext = createContext<
  AnyAuthConfig<Record<string, string>> | undefined
>(undefined)

export type AuthProviderProps<TLocalization = Record<string, string>> =
  PropsWithChildren<AnyAuthConfig<TLocalization>> & {
    authClient: AnyAuthClient
  }

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
