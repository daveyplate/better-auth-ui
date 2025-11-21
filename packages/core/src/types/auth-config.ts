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
  emailAndPassword?: EmailAndPasswordConfig | boolean
  socialProviders?: string[]
  navigate: (path: string) => void
  replace: (path: string) => void
  Link: LinkComponent
}

export const authViews = ["sign-in", "sign-up"] as const
export type AuthView = (typeof authViews)[number]
