import type { SocialProvider } from "better-auth/social-providers"
import type { ComponentPropsWithRef, ComponentType } from "react"
import {
  Apple,
  Discord,
  Dropbox,
  Facebook,
  GitHub,
  GitLab,
  Google,
  HuggingFace,
  Kick,
  Linear,
  LinkedIn,
  Microsoft,
  Notion,
  Reddit,
  Roblox,
  Slack,
  Spotify,
  TikTok,
  Twitch,
  VK,
  X,
  Zoom
} from "../components/icons"

const NullIcon = (_props: ComponentPropsWithRef<"svg">) => null

export const providerIcons: Record<
  SocialProvider,
  ComponentType<ComponentPropsWithRef<"svg">>
> = {
  apple: Apple,
  atlassian: NullIcon,
  cognito: NullIcon,
  discord: Discord,
  dropbox: Dropbox,
  facebook: Facebook,
  figma: NullIcon,
  github: GitHub,
  gitlab: GitLab,
  google: Google,
  huggingface: HuggingFace,
  kakao: NullIcon,
  kick: Kick,
  line: NullIcon,
  linear: Linear,
  linkedin: LinkedIn,
  microsoft: Microsoft,
  naver: NullIcon,
  notion: Notion,
  paybin: NullIcon,
  paypal: NullIcon,
  polar: NullIcon,
  reddit: Reddit,
  roblox: Roblox,
  salesforce: NullIcon,
  slack: Slack,
  spotify: Spotify,
  tiktok: TikTok,
  twitch: Twitch,
  twitter: X,
  vercel: NullIcon,
  vk: VK,
  zoom: Zoom
}
