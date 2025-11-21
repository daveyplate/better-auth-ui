type EmailAndPasswordConfig = {
  enabled?: boolean
  rememberMe?: boolean
}

export interface AuthConfig {
  emailAndPassword?: EmailAndPasswordConfig | boolean
  socialProviders?: string[]
  navigate?: (path: string) => void
  replace?: (path: string) => void
}
