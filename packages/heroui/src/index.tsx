"use client"

export {
  type AnyAuthClient,
  type AnyAuthConfig,
  type AuthClient,
  type AuthConfig,
  type AuthToast,
  type AuthView,
  authPaths,
  authViewPaths,
  authViews,
  basePaths,
  getProviderName,
  providerIcons,
  providerNames,
  useAuthenticate,
  useSignIn,
  viewPaths
} from "@better-auth-ui/react"

export * from "./components/auth/auth"
export * from "./components/auth/auth-provider"
export * from "./components/auth/forgot-password"
export * from "./components/auth/magic-link"
export * from "./components/auth/magic-link-button"
export * from "./components/auth/provider-buttons"
export * from "./components/auth/reset-password"
export * from "./components/auth/sign-in"
export * from "./components/auth/sign-out"
export * from "./components/auth/sign-up"
