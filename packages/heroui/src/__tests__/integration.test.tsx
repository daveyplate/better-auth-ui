import { describe, expect, it } from "vitest"

describe("@better-auth-ui/heroui integration", () => {
  it("should export main components", async () => {
    const module = await import("../index")

    expect(module).toHaveProperty("SignIn")
    expect(module).toHaveProperty("SignUp")
    expect(module).toHaveProperty("SignOut")
    expect(module).toHaveProperty("ForgotPassword")
    expect(module).toHaveProperty("ResetPassword")
    expect(module).toHaveProperty("MagicLink")
    expect(module).toHaveProperty("Auth")
    expect(module).toHaveProperty("ProviderButtons")
    expect(module).toHaveProperty("MagicLinkButton")
    expect(module).toHaveProperty("ResendVerificationButton")
  })

  it("should have all components as functions", async () => {
    const module = await import("../index")

    expect(typeof module.SignIn).toBe("function")
    expect(typeof module.SignUp).toBe("function")
    expect(typeof module.SignOut).toBe("function")
    expect(typeof module.ForgotPassword).toBe("function")
    expect(typeof module.ResetPassword).toBe("function")
    expect(typeof module.MagicLink).toBe("function")
    expect(typeof module.Auth).toBe("function")
  })
})

describe("@better-auth-ui/heroui server exports", () => {
  it("should export server utilities", async () => {
    const module = await import("../server")

    expect(module).toHaveProperty("authViewPaths")
    expect(module).toHaveProperty("viewPaths")
  })
})
