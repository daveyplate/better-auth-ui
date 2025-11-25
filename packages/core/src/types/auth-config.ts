import type { SocialProvider } from "better-auth/social-providers"

export type EmailAndPasswordConfig = {
  enabled: boolean
  forgotPassword: boolean
  rememberMe?: boolean
  requireEmailVerification?: boolean
}

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
}
