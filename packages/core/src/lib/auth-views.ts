export const authViews = [
  "sign-in",
  "sign-up",
  "magic-link",
  "sign-out"
] as const
export type AuthView = (typeof authViews)[number]
