import { describe, expect, it } from "vitest"

const componentNames = [
  "SignIn",
  "SignUp",
  "SignOut",
  "ForgotPassword",
  "ResetPassword",
  "MagicLink",
  "Auth",
  "ProviderButtons",
  "MagicLinkButton",
  "ResendVerificationButton"
] as const

describe("@better-auth-ui/heroui integration", () => {
  it("should export main components", async () => {
    const module = await import("../src/index")

    for (const name of componentNames) {
      expect(module).toHaveProperty(name)
    }
  })

  it("should have all components as functions", async () => {
    const module = await import("../src/index")

    for (const name of componentNames) {
      expect(typeof module[name]).toBe("function")
    }
  })
})

describe("@better-auth-ui/heroui server exports", () => {
  it("should export server utilities", async () => {
    const module = await import("../src/server")

    expect(module).toHaveProperty("authViewPaths")
    expect(module).toHaveProperty("viewPaths")
  })
})
