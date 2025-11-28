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

  describe("icon naming consistency", () => {
    it("should use lowercase keys for all providers", () => {
      Object.keys(providerIcons).forEach((key) => {
        expect(key).toBe(key.toLowerCase())
      })
    })

    it("should match all providers from core providerNames", () => {
      const coreProviderKeys = Object.keys(providerNames)
      const iconKeys = Object.keys(providerIcons)

      // providerIcons should match all providers from core providerNames (bidirectional check)
      const expectedKeys = [...coreProviderKeys].sort()
      const actualKeys = [...iconKeys].sort()
      expect(actualKeys).toEqual(expectedKeys)
    })
  })
})
