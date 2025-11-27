import { describe, expect, it } from "vitest"
import { getProviderName, providerNames } from "../lib/provider-names"

describe("providerNames", () => {
  it("should contain all expected social providers", () => {
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
      "vk",
      "zoom"
    ]

    expectedProviders.forEach((provider) => {
      expect(providerNames).toHaveProperty(provider)
      expect(typeof providerNames[provider]).toBe("string")
      expect(providerNames[provider].length).toBeGreaterThan(0)
    })
  })

  it("should have correct display names for common providers", () => {
    expect(providerNames.github).toBe("GitHub")
    expect(providerNames.google).toBe("Google")
    expect(providerNames.facebook).toBe("Facebook")
    expect(providerNames.apple).toBe("Apple")
    expect(providerNames.microsoft).toBe("Microsoft")
  })

  it("should have correct display names for specialized providers", () => {
    expect(providerNames.huggingface).toBe("Hugging Face")
    expect(providerNames.twitter).toBe("X")
    expect(providerNames.linkedin).toBe("LinkedIn")
  })

  it("should not have empty display names", () => {
    Object.values(providerNames).forEach((name) => {
      expect(name.trim()).not.toBe("")
    })
  })
})

describe("getProviderName", () => {
  describe("known providers", () => {
    it("should return correct display name for github", () => {
      expect(getProviderName("github")).toBe("GitHub")
    })

    it("should return correct display name for google", () => {
      expect(getProviderName("google")).toBe("Google")
    })

    it("should return correct display name for twitter (X)", () => {
      expect(getProviderName("twitter")).toBe("X")
    })

    it("should return correct display name for huggingface", () => {
      expect(getProviderName("huggingface")).toBe("Hugging Face")
    })

    it("should return correct display name for all registered providers", () => {
      Object.keys(providerNames).forEach((provider) => {
        const displayName = getProviderName(provider)
        expect(displayName).toBe(providerNames[provider])
      })
    })
  })

  describe("unknown providers", () => {
    it("should capitalize first letter of unknown provider", () => {
      expect(getProviderName("unknown")).toBe("Unknown")
    })

    it("should handle single character provider names", () => {
      expect(getProviderName("x")).toBe("X")
    })

    it("should capitalize first letter and keep rest lowercase", () => {
      expect(getProviderName("newprovider")).toBe("Newprovider")
    })

    it("should handle empty string gracefully", () => {
      expect(getProviderName("")).toBe("")
    })

    it("should handle provider names with numbers", () => {
      expect(getProviderName("auth0")).toBe("Auth0")
    })

    it("should handle provider names with hyphens", () => {
      expect(getProviderName("my-provider")).toBe("My-provider")
    })

    it("should handle provider names with underscores", () => {
      expect(getProviderName("my_provider")).toBe("My_provider")
    })
  })

  describe("edge cases", () => {
    it("should handle uppercase input", () => {
      expect(getProviderName("GITHUB")).toBe("GITHUB")
    })

    it("should handle mixed case input", () => {
      expect(getProviderName("GitHuB")).toBe("GitHuB")
    })

    it("should handle provider with special characters", () => {
      expect(getProviderName("provider@123")).toBe("Provider@123")
    })
  })
})