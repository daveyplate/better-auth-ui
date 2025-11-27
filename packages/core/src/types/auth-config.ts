import type { SocialProvider } from "better-auth/social-providers"
import type { ViewPaths } from "../lib/view-paths"

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
    organization: string
  }
  baseURL?: string
  emailAndPassword?: EmailAndPasswordConfig
  magicLink?: boolean
  redirectTo: string
  socialProviders?: SocialProvider[]
  viewPaths: ViewPaths
  navigate: (path: string) => void
  replace: (path: string) => void
}
