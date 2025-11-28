import { providerNames } from "@better-auth-ui/core"
import { socialProviderList } from "better-auth/social-providers"
import { describe, expect, it } from "vitest"
import { providerIcons } from "../../src/lib/provider-icons"

describe("providerIcons", () => {
  it("should export an object with all social provider icons", () => {
    expect(providerIcons).toBeDefined()
    expect(typeof providerIcons).toBe("object")
  })

  it("should contain all expected provider icons", () => {
    socialProviderList.forEach((provider) => {
      expect(providerIcons).toHaveProperty(provider)
    })
  })

  it("should have function components for each provider", () => {
    Object.values(providerIcons).forEach((IconComponent) => {
      expect(typeof IconComponent).toBe("function")
    })
  })

  it("should have exactly the right amount of provider icons", () => {
    expect(Object.keys(providerIcons)).toHaveLength(socialProviderList.length)
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

    it("should have icons for all provider names from core package", () => {
      const coreProviderKeys = Object.keys(providerNames)
      const iconKeys = Object.keys(providerIcons)

      // Every provider in core should have an icon
      coreProviderKeys.forEach((provider) => {
        expect(iconKeys).toContain(provider)
      })
    })

    it("should only contain known providers from core", () => {
      const coreProviderKeys = Object.keys(providerNames)
      const iconKeys = Object.keys(providerIcons)

      // providerIcons should match all providers from core providerNames
      const expectedKeys = coreProviderKeys.sort()
      expect(iconKeys.sort()).toEqual(expectedKeys)
    })
  })
})
