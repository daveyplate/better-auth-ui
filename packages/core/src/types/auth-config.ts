import type { SocialProvider } from "better-auth/social-providers"

export type EmailAndPasswordConfig = {
  enabled?: boolean
  rememberMe?: boolean
  forgotPassword?: boolean
  requireEmailVerification?: boolean
}

export type LinkComponent<T = unknown> = (props: {
  href: string
  children: T
  className?: string
  tabIndex?: number
}) => T

export interface AuthConfig {
  basePaths: {
    auth: string
    account: string
  }
  baseURL?: string
  emailAndPassword?: EmailAndPasswordConfig
  magicLink?: boolean
  redirectTo: string
  socialProviders?: SocialProvider[]
  navigate: (path: string) => void
  replace: (path: string) => void
  Link: LinkComponent
}
