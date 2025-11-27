export const authViewPaths = {
  signIn: "sign-in",
  signUp: "sign-up",
  magicLink: "magic-link",
  forgotPassword: "forgot-password",
  resetPassword: "reset-password",
  signOut: "sign-out"
}

export type AuthView = keyof typeof authViewPaths
export const authViews = Object.keys(authViewPaths) as AuthView[]
export const authPaths = Object.values(authViewPaths)

export const viewPaths = { auth: authViewPaths }

export type ViewPaths = typeof viewPaths
