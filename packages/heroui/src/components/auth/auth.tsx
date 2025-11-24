"use client"

import type { AuthView } from "@better-auth-ui/core"
import type { AuthClient, AuthConfig } from "@better-auth-ui/react"
import type { CardProps } from "@heroui/react"
import { MagicLink } from "./magic-link"
import { SignIn } from "./sign-in"
import { SignOut } from "./sign-out"
import { SignUp } from "./sign-up"

const authLocalization = {
  ...SignIn.localization,
  ...SignUp.localization,
  ...MagicLink.localization
}

export type AuthLocalization = typeof authLocalization

export type AuthProps<TAuthClient extends AuthClient> = CardProps &
  Partial<AuthConfig<TAuthClient>> & {
    view: AuthView | string
    localization?: Partial<AuthLocalization>
  }

export function Auth<TAuthClient extends AuthClient>({
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
    case "sign-out":
      return <SignOut {...props} />
  }
}

Auth.localization = authLocalization
