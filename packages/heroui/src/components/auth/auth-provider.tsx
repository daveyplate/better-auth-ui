import {
  AuthProvider as AuthProviderPrimitive,
  type AuthProviderProps
} from "@better-auth-ui/react"

import { Auth } from "./auth"

const authProviderLocalization = {
  ...Auth.localization
}

export type AuthProviderLocalization = typeof authProviderLocalization

export function AuthProvider(
  props: AuthProviderProps<AuthProviderLocalization>
) {
  return <AuthProviderPrimitive {...props} />
}

AuthProvider.localization = authProviderLocalization
