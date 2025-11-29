import type { SocialProvider } from "better-auth/social-providers"
import type { ViewPaths } from "../lib/view-paths"
import type { AuthToast } from "./auth-toast"

/**
 * Configuration options for email and password authentication.
 */
export type EmailAndPasswordConfig = {
  /** Whether email/password authentication is enabled */
  enabled: boolean
  /** Whether users can reset forgotten passwords */
  forgotPassword: boolean
  /** Whether to show a "Remember me" checkbox on sign-in forms */
  rememberMe?: boolean
  /** Whether email verification is required before account activation */
  requireEmailVerification?: boolean
}

/**
 * Core authentication configuration interface.
 *
 * Defines the base structure for authentication settings including paths,
 * providers, navigation functions, and feature flags.
 */
export interface AuthConfig {
  /** Base paths for different application sections */
  basePaths: {
    /** Base path for authentication routes */
    auth: string
    /** Base path for account management routes */
    account: string
    /** Base path for organization management routes */
    organization: string
  }
  /** Base URL for API endpoints (optional) */
  baseURL?: string
  /** Email and password authentication configuration */
  emailAndPassword?: EmailAndPasswordConfig
  /** Whether magic link (passwordless) authentication is enabled */
  magicLink?: boolean
  /** Default redirect path after successful authentication */
  redirectTo: string
  /** List of enabled social authentication providers */
  socialProviders?: SocialProvider[]
  /** View path mappings for different authentication views */
  viewPaths: ViewPaths
  /** Function to navigate to a new path (e.g., router.push) */
  navigate: (path: string) => void
  /** Function to replace current path (e.g., router.replace) */
  replace: (path: string) => void
  toast: {
    // biome-ignore lint/suspicious/noExplicitAny: allow any additional keys for toast functions
    [key: string]: any
    error: AuthToast
    success: AuthToast
    info: AuthToast
    // biome-ignore lint/suspicious/noExplicitAny: Flexible dismiss for toasts
    dismiss?: (id?: number | string | any) => string | number | any
  }
}
