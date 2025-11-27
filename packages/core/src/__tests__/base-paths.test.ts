import { describe, expect, it } from "vitest"
import { basePaths } from "../lib/base-paths"

describe("basePaths", () => {
  it("should contain all expected base paths", () => {
    expect(basePaths).toHaveProperty("auth")
    expect(basePaths).toHaveProperty("account")
    expect(basePaths).toHaveProperty("organization")
  })

  it("should have correct path values", () => {
    expect(basePaths.auth).toBe("/auth")
    expect(basePaths.account).toBe("/account")
    expect(basePaths.organization).toBe("/organization")
  })

  it("should start all paths with forward slash", () => {
    Object.values(basePaths).forEach((path) => {
      expect(path).toMatch(/^\//)
    })
  })

  it("should not end paths with forward slash", () => {
    Object.values(basePaths).forEach((path) => {
      expect(path).not.toMatch(/\/$/)
    })
  })

  it("should use lowercase for all paths", () => {
    Object.values(basePaths).forEach((path) => {
      expect(path).toBe(path.toLowerCase())
    })
  })

  it("should not have empty path values", () => {
    Object.values(basePaths).forEach((path) => {
      expect(path.trim()).not.toBe("")
      expect(path.length).toBeGreaterThan(1)
    })
  })

  it("should have exactly 3 base paths", () => {
    expect(Object.keys(basePaths)).toHaveLength(3)
  })

  it("should not contain query parameters", () => {
    Object.values(basePaths).forEach((path) => {
      expect(path).not.toContain("?")
      expect(path).not.toContain("&")
    })
  })

  it("should not contain URL fragments", () => {
    Object.values(basePaths).forEach((path) => {
      expect(path).not.toContain("#")
    })
  })
})