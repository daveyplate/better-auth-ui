import type { AuthView } from "@better-auth-ui/core"
import type { AnyAuthConfig } from "@better-auth-ui/react"

import { useAuth } from "../../hooks/use-auth"
import { ForgotPassword } from "./forgot-password"
import { MagicLink } from "./magic-link"
import type { SocialLayout } from "./provider-buttons"
import { ResetPassword } from "./reset-password"
import { SignIn } from "./sign-in"
import { SignOut } from "./sign-out"
import { SignUp } from "./sign-up"

export type AuthProps = AnyAuthConfig & {
  className?: string
  path?: string
  view?: AuthView
  socialLayout?: SocialLayout
}

/**
 * Selects and renders the appropriate authentication view component.
 *
 * @param view - Explicit auth view to render (e.g., "signIn", "signUp")
 * @param path - Route path used to resolve an auth view when `view` is not provided
 * @returns The React element for the resolved authentication view
 * @throws Error if neither `view` nor `path` resolve to a valid auth view; the error message lists valid view keys
 */
export function Auth({
  className,
  view,
  path,
  socialLayout,
  ...config
}: AuthProps) {
  const { viewPaths } = useAuth(config)

  if (!view && !path) {
    throw new Error("[Better Auth UI] Either `view` or `path` must be provided")
  }

  const authPathViews = Object.fromEntries(
    Object.entries(viewPaths.auth).map(([k, v]) => [v, k])
  ) as Record<string, AuthView>

  const currentView = view || authPathViews[path ?? ""]

  switch (currentView) {
    case "signIn":
      return (
        <SignIn className={className} socialLayout={socialLayout} {...config} />
      )
    case "signUp":
      return (
        <SignUp className={className} socialLayout={socialLayout} {...config} />
      )
    case "magicLink":
      return (
        <MagicLink
          className={className}
          socialLayout={socialLayout}
          {...config}
        />
      )
    case "forgotPassword":
      return <ForgotPassword className={className} {...config} />
    case "resetPassword":
      return <ResetPassword className={className} {...config} />
    case "signOut":
      return <SignOut className={className} {...config} />
    default:
      throw new Error(
        `[Better Auth UI] Valid views are: ${Object.keys(viewPaths.auth).join(", ")}`
      )
  }
}
