import type { SocialProvider } from "better-auth/social-providers"

/**
 * Mapping of social authentication provider identifiers to their human-readable display names.
 *
 * Provides standardized display names for all supported social authentication providers.
 * Used by the `getProviderName` function to convert provider keys (e.g., "github") to
 * user-friendly names (e.g., "GitHub").
 */
export const providerNames = {
  apple: "Apple",
  atlassian: "Atlassian",
  cognito: "Cognito",
  discord: "Discord",
  dropbox: "Dropbox",
  facebook: "Facebook",
  figma: "Figma",
  github: "GitHub",
  gitlab: "GitLab",
  google: "Google",
  huggingface: "Hugging Face",
  kakao: "Kakao",
  kick: "Kick",
  line: "LINE",
  linear: "Linear",
  linkedin: "LinkedIn",
  microsoft: "Microsoft",
  naver: "Naver",
  notion: "Notion",
  paybin: "Paybin",
  paypal: "PayPal",
  polar: "Polar",
  reddit: "Reddit",
  roblox: "Roblox",
  salesforce: "Salesforce",
  slack: "Slack",
  spotify: "Spotify",
  tiktok: "TikTok",
  twitch: "Twitch",
  twitter: "X",
  vk: "VK",
  zoom: "Zoom"
} as Record<SocialProvider, string>

/**
 * Get the human-readable display name for an authentication provider.
 *
 * @param provider - The provider identifier (e.g., "github", "google").
 * @returns The mapped display name for `provider` if available, otherwise `provider` with its first character capitalized.
 */
export function getProviderName(provider: string): string {
  return (
    providerNames[provider as keyof typeof providerNames] ||
    provider.charAt(0).toUpperCase() + provider.slice(1)
  )
}
