"use client"

export {
  type AuthToast,
  type AuthView,
  authPaths,
  authViewPaths,
  authViews,
  basePaths,
  getProviderName,
  providerNames,
  viewPaths
} from "@better-auth-ui/core"

export * from "./components/auth/auth-provider"
export * from "./components/emails"
export * from "./components/icons"
export * from "./hooks/auth/use-auth"
export * from "./hooks/auth/use-authenticate"
export * from "./hooks/auth/use-sign-in"
export * from "./lib/provider-icons"
export { deepmerge } from "./lib/utils"
export * from "./types/auth-client"
