import type { SocialProvider } from "better-auth/social-providers"
import { basePaths } from "../lib/base-paths"
import { type ViewPaths, viewPaths } from "../lib/view-paths"
import { type Localization, localization } from "../localization"
import type { AuthToast } from "./auth-toast"

const defaultToast: AuthToast = (message, options) => {
  if (options?.action) {
    if (confirm(message)) {
      options.action.onClick()
    }
  } else {
    alert(message)
  }
}

export const defaultConfig = {
  basePaths: basePaths,
  baseURL: "",
  emailAndPassword: {
    enabled: true,
    forgotPassword: true,
    rememberMe: false
  },
  redirectTo: "/",
  viewPaths: viewPaths,
  localization: localization,
  navigate: (path: string) => {
    window.location.href = path
  },
  replace: (path: string) => window.location.replace(path),
  toast: {
    error: defaultToast,
    success: defaultToast,
    info: defaultToast
  }
} satisfies AuthConfig

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
  /** Localization strings for UI components. */
  localization: Localization
  /** Whether magic link (passwordless) authentication is enabled */
  magicLink?: boolean
  /** Default redirect path after successful authentication */
  redirectTo: string
  /** List of enabled social authentication providers */
  socialProviders?: SocialProvider[]
  /** View path mappings for different authentication views */
  viewPaths: ViewPaths
  /** Toast notification configuration for user feedback. Functions accept optional message and action options, and should return a toast ID for dismiss. */
  toast: {
    // biome-ignore lint/suspicious/noExplicitAny: allow any additional keys for toast functions
    [key: string]: any
    /** Display an error toast notification */
    error: AuthToast
    /** Display a success toast notification */
    success: AuthToast
    /** Display an info toast notification */
    info: AuthToast
    /** Optional function to dismiss a toast notification by its ID */
    // biome-ignore lint/suspicious/noExplicitAny: Flexible dismiss for toasts
    dismiss?: (id?: number | string | any) => string | number | any
  }
  /** Function to navigate to a new path (e.g., router.push) */
  navigate: (path: string) => void
  /** Function to replace current path (e.g., router.replace) */
  replace: (path: string) => void
}
