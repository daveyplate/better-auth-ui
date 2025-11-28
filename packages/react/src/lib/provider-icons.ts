import type { SocialProvider } from "better-auth/social-providers"
import type { ComponentPropsWithRef, ComponentType } from "react"
import {
  Apple,
  Atlassian,
  Cognito,
  Discord,
  Dropbox,
  Facebook,
  Figma,
  GitHub,
  GitLab,
  Google,
  HuggingFace,
  Kakao,
  Kick,
  Line,
  Linear,
  LinkedIn,
  Microsoft,
  Naver,
  Notion,
  Paybin,
  PayPal,
  Polar,
  Reddit,
  Roblox,
  Salesforce,
  Slack,
  Spotify,
  TikTok,
  Twitch,
  Vercel,
  VK,
  X,
  Zoom
} from "../components/icons"

/**
 * Mapping of social authentication provider names to their corresponding icon components.
 *
 * Provides React SVG icon components for all supported social authentication providers.
 * Each icon is a React component that accepts standard SVG props and can be customized
 * with className, size, color, etc.
 *
 * Supported providers include: Apple, Google, GitHub, Microsoft, Discord, Facebook,
 * Twitter/X, and many others.
 */
export const providerIcons: Record<
  SocialProvider,
  ComponentType<ComponentPropsWithRef<"svg">>
> = {
  apple: Apple,
  atlassian: Atlassian,
  cognito: Cognito,
  discord: Discord,
  dropbox: Dropbox,
  facebook: Facebook,
  figma: Figma,
  github: GitHub,
  gitlab: GitLab,
  google: Google,
  huggingface: HuggingFace,
  kakao: Kakao,
  kick: Kick,
  line: Line,
  linear: Linear,
  linkedin: LinkedIn,
  microsoft: Microsoft,
  naver: Naver,
  notion: Notion,
  paybin: Paybin,
  paypal: PayPal,
  polar: Polar,
  reddit: Reddit,
  roblox: Roblox,
  salesforce: Salesforce,
  slack: Slack,
  spotify: Spotify,
  tiktok: TikTok,
  twitch: Twitch,
  twitter: X,
  vercel: Vercel,
  vk: VK,
  zoom: Zoom
}
