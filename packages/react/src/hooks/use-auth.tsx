"use client"

import { basePaths, viewPaths } from "@better-auth-ui/core"
import type { DeepPartial } from "better-auth/react"
import deepmerge from "deepmerge"
import { useContext } from "react"
import type { AuthConfig } from "../components/auth-provider"
import { AuthContext } from "../components/auth-provider"
import { useHydrated } from "./use-hydrated"

const defaultConfig = {
  basePaths,
  baseURL: "",
  emailAndPassword: {
    enabled: true,
    forgotPassword: true,
    rememberMe: false
  },
  redirectTo: "/",
  viewPaths,
  navigate: (path: string) => {
    window.location.href = path
  },
  replace: (path: string) => window.location.replace(path),
  Link: (props) => <a {...props} />
} satisfies Omit<AuthConfig, "authClient">

/**
 * Constructs the effective AuthConfig by merging defaults, any AuthContext-provided config, and the optional `config` overrides.
 *
 * When the app is hydrated, a `redirectTo` query parameter may override the merged `redirectTo` only if it decodes to a safe relative path: starts with `/`, does not start with `//`, and does not contain a scheme (`://`).
 *
 * @param config - Partial configuration overrides applied on top of context and defaults
 * @returns The final `AuthConfig` with a non-optional `authClient`
 * @throws If the resulting config does not include an `authClient`
 */
export function useAuth(config?: DeepPartial<AuthConfig>) {
  const context = useContext(AuthContext)
  const hydrated = useHydrated()

  const authConfig = deepmerge(
    defaultConfig,
    deepmerge(context || {}, config || {})
  )

  if (authConfig.authClient === undefined) {
    throw new Error("[Better Auth UI] authClient is required")
  }

  // Validate redirectTo from URL search params to prevent open redirect vulnerabilities
  if (hydrated) {
    const redirectToParam = new URLSearchParams(window.location.search).get(
      "redirectTo"
    )

    if (redirectToParam) {
      const redirectTo = redirectToParam.trim()

      // Validate: must be a relative path starting with "/" but not "//"
      // and must not contain a scheme (e.g., "://")
      const isValidRedirect =
        redirectTo.startsWith("/") &&
        !redirectTo.startsWith("//") &&
        !redirectTo.includes("://")

      if (isValidRedirect) {
        authConfig.redirectTo = redirectTo
      }
    }
  }

  return authConfig as AuthConfig
}
