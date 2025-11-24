"use client"

import type { AuthView } from "@better-auth-ui/core"
import type { AuthClient, AuthConfig } from "@better-auth-ui/react"
import type { CardProps } from "@heroui/react"

import { MagicLink, magicLinkLocalization } from "./magic-link"
import { SignIn, signInLocalization } from "./sign-in"
import { SignOut } from "./sign-out"
import { SignUp, signUpLocalization } from "./sign-up"

export const authLocalization = {
  ...signInLocalization,
  ...signUpLocalization,
  ...magicLinkLocalization
}

export type AuthLocalization = typeof authLocalization

export type AuthProps<TAuthClient extends AuthClient> = CardProps &
  Partial<AuthConfig<TAuthClient>> & {
    view: AuthView | string
    localization?: Partial<AuthLocalization>
  }

export function Auth<TAuthClient extends AuthClient>({
  view,
  localization,
  ...props
}: AuthProps<TAuthClient>) {
  localization = { ...authLocalization, ...localization }

  switch (view) {
    case "sign-in":
      return <SignIn localization={localization} {...props} />
    case "sign-up":
      return <SignUp localization={localization} {...props} />
    case "magic-link":
      return <MagicLink localization={localization} {...props} />
    case "sign-out":
      return <SignOut {...props} />
  }
}
