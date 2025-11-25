"use client"

import { type AuthView, authViews } from "@better-auth-ui/core"
import type { AnyAuthClient, AuthConfig } from "@better-auth-ui/react"
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

export type AuthProps<TAuthClient extends AnyAuthClient> = Partial<
  AuthConfig<TAuthClient>
> & {
  view: AuthView | string
  className?: string
  localization?: Partial<AuthLocalization>
}

export function Auth<TAuthClient extends AnyAuthClient>({
  view,
  ...props
}: AuthProps<TAuthClient>) {
  switch (view) {
    case "sign-in":
      return <SignIn {...props} />
    case "sign-up":
      return <SignUp {...props} />
    case "magic-link":
      return <MagicLink {...props} />
    case "forgot-password":
      return <ForgotPassword {...props} />
    case "reset-password":
      return <ResetPassword {...props} />
    case "sign-out":
      return <SignOut {...props} />
    default:
      throw new Error(
        `Invalid auth view: "${view}". Valid views are: ${authViews.join(", ")}`
      )
  }
}

Auth.localization = localization
