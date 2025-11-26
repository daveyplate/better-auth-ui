"use client"

import { viewPaths } from "@better-auth-ui/core"
import type { DeepPartial } from "better-auth/react"
import deepmerge from "deepmerge"
import { useContext } from "react"
import type { AuthConfig } from "../components/auth-provider"
import { AuthContext } from "../components/auth-provider"
import { useHydrated } from "./use-hydrated"

const defaultConfig = {
  basePaths: {
    auth: "/auth",
    account: "/account"
  },
  baseURL: "",
  emailAndPassword: {
    enabled: true,
    forgotPassword: true
  },
  redirectTo: "/",
  viewPaths: viewPaths,
  navigate: (path: string) => {
    window.location.href = path
  },
  replace: (path: string) => window.location.replace(path),
  Link: (props) => <a {...props} />
} satisfies Omit<AuthConfig, "authClient">

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
      const decodedRedirectTo = decodeURIComponent(redirectToParam).trim()

      // Validate: must be a relative path starting with "/" but not "//"
      // and must not contain a scheme (e.g., "://")
      const isValidRedirect =
        decodedRedirectTo.startsWith("/") &&
        !decodedRedirectTo.startsWith("//") &&
        !decodedRedirectTo.includes("://")

      if (isValidRedirect) {
        authConfig.redirectTo = decodedRedirectTo
      }
    }
  }

  return authConfig as AuthConfig
}
