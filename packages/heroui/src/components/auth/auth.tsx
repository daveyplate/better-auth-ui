"use client"

import type { AuthView } from "@better-auth-ui/core"
import { type AuthConfig, useAuth } from "@better-auth-ui/react"
import type { DeepPartial } from "better-auth/client/plugins"

import { ForgotPassword } from "./forgot-password"
import { MagicLink } from "./magic-link"
import type { SocialLayout } from "./provider-buttons"
import { ResetPassword } from "./reset-password"
import { SignIn } from "./sign-in"
import { SignOut } from "./sign-out"
import { SignUp } from "./sign-up"

const authLocalization = {
  ...SignIn.localization,
  ...SignUp.localization,
  ...MagicLink.localization,
  ...ForgotPassword.localization,
  ...ResetPassword.localization
}

export type AuthLocalization = typeof authLocalization

export type AuthProps = DeepPartial<AuthConfig> & {
  className?: string
  localization?: Partial<AuthLocalization>
  path?: string
  view?: AuthView
  socialLayout?: SocialLayout
}

/**
 * Selects and renders the appropriate authentication view component.
 *
 * @param view - Optional explicit auth view to render (e.g., "signIn", "signUp")
 * @param path - Optional route path used to resolve an auth view when `view` is not provided
 * @returns The React element for the resolved authentication view
 * @throws Error if neither `view` nor `path` resolve to a valid auth view; the error message lists valid view keys
 */
export function Auth({ view, path, ...props }: AuthProps) {
  const { viewPaths } = useAuth()

  const currentView =
    view ||
    (Object.keys(viewPaths.auth).find(
      (key) => viewPaths.auth[key as AuthView] === path
    ) as AuthView | undefined)

  switch (currentView) {
    case "signIn":
      return <SignIn {...props} />
    case "signUp":
      return <SignUp {...props} />
    case "magicLink":
      return <MagicLink {...props} />
    case "forgotPassword":
      return <ForgotPassword {...props} />
    case "resetPassword":
      return <ResetPassword {...props} />
    case "signOut":
      return <SignOut {...props} />
    default:
      throw new Error(
        `Valid views are: ${Object.keys(viewPaths.auth).join(", ")}`
      )
  }
}

Auth.localization = authLocalization