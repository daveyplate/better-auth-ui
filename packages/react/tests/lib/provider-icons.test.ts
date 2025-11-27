import { describe, expect, it } from "vitest"
import { providerIcons } from "../../src/lib/provider-icons"

describe("providerIcons", () => {
  it("should export an object with all social provider icons", () => {
    expect(providerIcons).toBeDefined()
    expect(typeof providerIcons).toBe("object")
  })

  it("should contain all expected provider icons", () => {
    const expectedProviders = [
      "apple",
      "atlassian",
      "cognito",
      "discord",
      "dropbox",
      "facebook",
      "figma",
      "github",
      "gitlab",
      "google",
      "huggingface",
      "kakao",
      "kick",
      "line",
      "linear",
      "linkedin",
      "microsoft",
      "naver",
      "notion",
      "paybin",
      "paypal",
      "polar",
      "reddit",
      "roblox",
      "salesforce",
      "slack",
      "spotify",
      "tiktok",
      "twitch",
      "twitter",
      "vercel",
      "vk",
      "zoom"
    ]

    expectedProviders.forEach((provider) => {
      expect(providerIcons).toHaveProperty(provider)
    })
  })

  it("should have function components for each provider", () => {
    Object.values(providerIcons).forEach((IconComponent) => {
      expect(typeof IconComponent).toBe("function")
    })
  })

  it("should have exactly 33 provider icons", () => {
    expect(Object.keys(providerIcons)).toHaveLength(33)
  })

  describe("common provider icons", () => {
    it("should have GitHub icon", () => {
      expect(providerIcons.github).toBeDefined()
      expect(typeof providerIcons.github).toBe("function")
    })

    it("should have Google icon", () => {
      expect(providerIcons.google).toBeDefined()
      expect(typeof providerIcons.google).toBe("function")
    })

    it("should have Facebook icon", () => {
      expect(providerIcons.facebook).toBeDefined()
      expect(typeof providerIcons.facebook).toBe("function")
    })

    it("should have Apple icon", () => {
      expect(providerIcons.apple).toBeDefined()
      expect(typeof providerIcons.apple).toBe("function")
    })

    it("should have Microsoft icon", () => {
      expect(providerIcons.microsoft).toBeDefined()
      expect(typeof providerIcons.microsoft).toBe("function")
    })
  })

  describe("specialized provider icons", () => {
    it("should have Discord icon", () => {
      expect(providerIcons.discord).toBeDefined()
    })

    it("should have Twitch icon", () => {
      expect(providerIcons.twitch).toBeDefined()
    })

    it("should have LinkedIn icon", () => {
      expect(providerIcons.linkedin).toBeDefined()
    })

    it("should have X (Twitter) icon", () => {
      expect(providerIcons.twitter).toBeDefined()
    })

    it("should have Spotify icon", () => {
      expect(providerIcons.spotify).toBeDefined()
    })
  })

  describe("icon naming consistency", () => {
    it("should use lowercase keys for all providers", () => {
      Object.keys(providerIcons).forEach((key) => {
        expect(key).toBe(key.toLowerCase())
      })
    })

    it("should match provider names from core package", () => {
      const expectedKeys = [
        "apple",
        "atlassian",
        "cognito",
        "discord",
        "dropbox",
        "facebook",
        "figma",
        "github",
        "gitlab",
        "google",
        "huggingface",
        "kakao",
        "kick",
        "line",
        "linear",
        "linkedin",
        "microsoft",
        "naver",
        "notion",
        "paybin",
        "paypal",
        "polar",
        "reddit",
        "roblox",
        "salesforce",
        "slack",
        "spotify",
        "tiktok",
        "twitch",
        "twitter",
        "vercel",
        "vk",
        "zoom"
      ]

      const actualKeys = Object.keys(providerIcons).sort()
      expect(actualKeys).toEqual(expectedKeys.sort())
    })
  })
})
