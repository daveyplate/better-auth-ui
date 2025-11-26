import type { SocialProvider } from "better-auth/social-providers"

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

export function getProviderName(provider: string): string {
  return (
    providerNames[provider as keyof typeof providerNames] ||
    provider.charAt(0).toUpperCase() + provider.slice(1)
  )
}
