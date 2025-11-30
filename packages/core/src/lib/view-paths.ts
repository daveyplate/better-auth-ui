/**
 * Path segments for different authentication views.
 */
const authViewPaths = {
  signIn: "sign-in",
  signUp: "sign-up",
  magicLink: "magic-link",
  forgotPassword: "forgot-password",
  resetPassword: "reset-password",
  signOut: "sign-out"
}

/**
 * Valid auth view key.
 */
export type AuthView = keyof typeof authViewPaths

/**
 * All view path segments.
 */
export const viewPaths = { auth: authViewPaths }

/**
 * Provides type information for the nested view path structure used throughout
 * the application for routing and navigation.
 */
export type ViewPaths = typeof viewPaths
