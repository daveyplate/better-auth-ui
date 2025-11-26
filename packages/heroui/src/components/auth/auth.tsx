"use client"

import type { AuthView } from "@better-auth-ui/core"
import { type AuthConfig, useAuth } from "@better-auth-ui/react"
import type { DeepPartial } from "better-auth/client/plugins"
import { ForgotPassword } from "./forgot-password"
import { MagicLink } from "./magic-link"
import { ResetPassword } from "./reset-password"
import { SignIn } from "./sign-in"
import { SignOut } from "./sign-out"
import { SignUp } from "./sign-up"

const localization = {
  ...SignIn.localization,
  ...SignUp.localization,
  ...MagicLink.localization,
  ...ForgotPassword.localization,
  ...ResetPassword.localization
}

export type AuthLocalization = typeof localization

export type AuthProps = DeepPartial<AuthConfig> & {
  view?: AuthView
  path?: string
  className?: string
  localization?: Partial<AuthLocalization>
}

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
        `Valid paths are: ${Object.keys(viewPaths.auth).join(", ")}`
      )
  }
}

Auth.localization = localization
