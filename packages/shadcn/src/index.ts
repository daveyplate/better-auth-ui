"use client"

export {
  type AnyAuthClient,
  type AnyAuthConfig,
  type AuthClient,
  type AuthConfig,
  AuthProvider,
  useAuthenticate,
  useSignInEmail,
  useSignInMagicLink,
  useSignInSocial,
  useSignUpEmail
} from "@better-auth-ui/react"
export * from "./components/auth/auth"
export * from "./components/auth/magic-link"
export * from "./components/auth/magic-link-button"
export * from "./components/auth/provider-buttons"
export * from "./components/auth/sign-in"
export * from "./components/auth/sign-up"
