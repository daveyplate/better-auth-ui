export const authViews = [
  "sign-in",
  "sign-up",
  "magic-link",
  "forgot-password",
  "reset-password",
  "sign-out"
] as const

export type AuthView = (typeof authViews)[number]
