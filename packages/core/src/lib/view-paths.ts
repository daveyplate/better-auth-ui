/**
 * Path segments for different authentication views.
 *
 * These are relative path segments (not full URLs) that identify specific
 * authentication pages like sign-in, sign-up, password reset, etc.
 */
export const authViewPaths = {
  signIn: "sign-in",
  signUp: "sign-up",
  magicLink: "magic-link",
  forgotPassword: "forgot-password",
  resetPassword: "reset-password",
  signOut: "sign-out"
}

/**
 * Type representing valid authentication view keys.
 *
 * Used for type-safe references to authentication views throughout the application.
 */
export type AuthView = keyof typeof authViewPaths

/**
 * Array of all available authentication view keys.
 *
 * Useful for iterating over all available auth views or validating view names.
 */
export const authViews = Object.keys(authViewPaths) as AuthView[]

/**
 * Array of all authentication view path segments.
 *
 * Contains the path values (e.g., "sign-in", "sign-up") for all authentication views.
 */
export const authPaths = Object.values(authViewPaths)

/**
 * Nested object containing view paths organized by feature area.
 *
 * Currently contains authentication view paths, but can be extended to include
 * other feature areas like account management, organization settings, etc.
 */
export const viewPaths = { auth: authViewPaths }

/**
 * Type representing the structure of all view paths.
 *
 * Provides type information for the nested view path structure used throughout
 * the application for routing and navigation.
 */
export type ViewPaths = typeof viewPaths
