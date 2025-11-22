import type { SocialProvider } from "better-auth/social-providers"

type EmailAndPasswordConfig = {
  enabled?: boolean
  rememberMe?: boolean
}

export type LinkComponent<T = unknown> = (props: {
  href: string
  children: T
  className?: string
}) => T

export interface AuthConfig {
  emailAndPassword?: EmailAndPasswordConfig
  socialProviders?: SocialProvider[]
  magicLink?: boolean
  navigate: (path: string) => void
  replace: (path: string) => void
  Link: LinkComponent
}

export const authViews = ["sign-in", "sign-up", "magic-link"] as const
export type AuthView = (typeof authViews)[number]
