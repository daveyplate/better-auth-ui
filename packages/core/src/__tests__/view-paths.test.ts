import { describe, expect, it } from "vitest"
import {
  type AuthView,
  authPaths,
  authViewPaths,
  authViews,
  type ViewPaths,
  viewPaths
} from "../lib/view-paths"

describe("authViewPaths", () => {
  it("should contain all expected view paths", () => {
    expect(authViewPaths).toHaveProperty("signIn")
    expect(authViewPaths).toHaveProperty("signUp")
    expect(authViewPaths).toHaveProperty("magicLink")
    expect(authViewPaths).toHaveProperty("forgotPassword")
    expect(authViewPaths).toHaveProperty("resetPassword")
    expect(authViewPaths).toHaveProperty("signOut")
  })

  it("should have correct path values", () => {
    expect(authViewPaths.signIn).toBe("sign-in")
    expect(authViewPaths.signUp).toBe("sign-up")
    expect(authViewPaths.magicLink).toBe("magic-link")
    expect(authViewPaths.forgotPassword).toBe("forgot-password")
    expect(authViewPaths.resetPassword).toBe("reset-password")
    expect(authViewPaths.signOut).toBe("sign-out")
  })

  it("should use kebab-case for all paths", () => {
    Object.values(authViewPaths).forEach((path) => {
      expect(path).toMatch(/^[a-z]+(-[a-z]+)*$/)
    })
  })

  it("should not have empty path values", () => {
    Object.values(authViewPaths).forEach((path) => {
      expect(path.trim()).not.toBe("")
    })
  })

  it("should have exactly 6 view paths", () => {
    expect(Object.keys(authViewPaths)).toHaveLength(6)
  })
})

describe("authViews", () => {
  it("should be an array of auth view keys", () => {
    expect(Array.isArray(authViews)).toBe(true)
    expect(authViews.length).toBe(6)
  })

  it("should contain all expected view keys", () => {
    expect(authViews).toContain("signIn")
    expect(authViews).toContain("signUp")
    expect(authViews).toContain("magicLink")
    expect(authViews).toContain("forgotPassword")
    expect(authViews).toContain("resetPassword")
    expect(authViews).toContain("signOut")
  })

  it("should match keys of authViewPaths", () => {
    const expectedKeys = Object.keys(authViewPaths)
    expect(authViews.sort()).toEqual(expectedKeys.sort())
  })

  it("should have valid AuthView type elements", () => {
    authViews.forEach((view) => {
      expect(typeof view).toBe("string")
      expect(authViewPaths).toHaveProperty(view)
    })
  })
})

describe("authPaths", () => {
  it("should be an array of auth path values", () => {
    expect(Array.isArray(authPaths)).toBe(true)
    expect(authPaths.length).toBe(6)
  })

  it("should contain all expected path values", () => {
    expect(authPaths).toContain("sign-in")
    expect(authPaths).toContain("sign-up")
    expect(authPaths).toContain("magic-link")
    expect(authPaths).toContain("forgot-password")
    expect(authPaths).toContain("reset-password")
    expect(authPaths).toContain("sign-out")
  })

  it("should match values of authViewPaths", () => {
    const expectedValues = Object.values(authViewPaths)
    expect(authPaths.sort()).toEqual(expectedValues.sort())
  })

  it("should have no duplicates", () => {
    const uniquePaths = [...new Set(authPaths)]
    expect(authPaths).toEqual(uniquePaths)
  })
})

describe("viewPaths", () => {
  it("should have auth property", () => {
    expect(viewPaths).toHaveProperty("auth")
  })

  it("should reference authViewPaths", () => {
    expect(viewPaths.auth).toBe(authViewPaths)
  })

  it("should maintain all auth view paths", () => {
    expect(viewPaths.auth.signIn).toBe("sign-in")
    expect(viewPaths.auth.signUp).toBe("sign-up")
    expect(viewPaths.auth.magicLink).toBe("magic-link")
    expect(viewPaths.auth.forgotPassword).toBe("forgot-password")
    expect(viewPaths.auth.resetPassword).toBe("reset-password")
    expect(viewPaths.auth.signOut).toBe("sign-out")
  })
})

describe("type safety", () => {
  it("should allow valid AuthView types", () => {
    const validViews: AuthView[] = [
      "signIn",
      "signUp",
      "magicLink",
      "forgotPassword",
      "resetPassword",
      "signOut"
    ]

    validViews.forEach((view) => {
      expect(authViewPaths[view]).toBeDefined()
    })
  })

  it("should have correct ViewPaths structure", () => {
    const paths: ViewPaths = viewPaths
    expect(paths.auth).toBeDefined()
    expect(typeof paths.auth.signIn).toBe("string")
  })
})