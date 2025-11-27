import { describe, expect, it } from "vitest"
import { cn } from "../utils"

describe("cn (className utility)", () => {
  describe("basic functionality", () => {
    it("should merge simple class names", () => {
      expect(cn("px-2", "py-1")).toBe("px-2 py-1")
    })

    it("should handle single class name", () => {
      expect(cn("text-center")).toBe("text-center")
    })

    it("should handle empty input", () => {
      expect(cn()).toBe("")
    })

    it("should handle multiple class names", () => {
      expect(cn("text-sm", "font-bold", "text-blue-500")).toBe(
        "text-sm font-bold text-blue-500"
      )
    })
  })

  describe("conditional classes", () => {
    it("should handle undefined values", () => {
      expect(cn("px-2", undefined, "py-1")).toBe("px-2 py-1")
    })

    it("should handle null values", () => {
      expect(cn("px-2", null, "py-1")).toBe("px-2 py-1")
    })

    it("should handle false values", () => {
      expect(cn("px-2", false, "py-1")).toBe("px-2 py-1")
    })

    it("should handle conditional expressions", () => {
      expect(cn("px-2", true && "py-1")).toBe("px-2 py-1")
      expect(cn("px-2", false && "py-1")).toBe("px-2")
    })

    it("should handle empty strings", () => {
      expect(cn("px-2", "", "py-1")).toBe("px-2 py-1")
    })
  })

  describe("Tailwind merge functionality", () => {
    it("should resolve conflicting padding classes", () => {
      const result = cn("px-2", "px-4")
      expect(result).toBe("px-4")
    })

    it("should resolve conflicting margin classes", () => {
      const result = cn("m-2", "m-4")
      expect(result).toBe("m-4")
    })

    it("should resolve conflicting text color classes", () => {
      const result = cn("text-red-500", "text-blue-500")
      expect(result).toBe("text-blue-500")
    })

    it("should resolve conflicting background color classes", () => {
      const result = cn("bg-white", "bg-black")
      expect(result).toBe("bg-black")
    })

    it("should keep non-conflicting classes", () => {
      const result = cn("px-2", "py-4", "text-center")
      expect(result).toContain("px-2")
      expect(result).toContain("py-4")
      expect(result).toContain("text-center")
    })
  })

  describe("array inputs", () => {
    it("should handle array of class names", () => {
      expect(cn(["px-2", "py-1"])).toBe("px-2 py-1")
    })

    it("should handle nested arrays", () => {
      expect(cn(["px-2", ["py-1", "text-sm"]])).toContain("px-2")
      expect(cn(["px-2", ["py-1", "text-sm"]])).toContain("py-1")
      expect(cn(["px-2", ["py-1", "text-sm"]])).toContain("text-sm")
    })

    it("should handle arrays with conditionals", () => {
      expect(cn(["px-2", false && "py-1", "text-sm"])).toBe("px-2 text-sm")
    })
  })

  describe("object inputs", () => {
    it("should handle object with boolean values", () => {
      const result = cn({
        "px-2": true,
        "py-1": false,
        "text-sm": true
      })
      expect(result).toContain("px-2")
      expect(result).not.toContain("py-1")
      expect(result).toContain("text-sm")
    })

    it("should handle mixed inputs", () => {
      const result = cn("px-2", { "py-1": true, "m-0": false }, "text-sm")
      expect(result).toContain("px-2")
      expect(result).toContain("py-1")
      expect(result).not.toContain("m-0")
      expect(result).toContain("text-sm")
    })
  })

  describe("complex scenarios", () => {
    it("should handle component variant patterns", () => {
      const baseClasses = "rounded-md font-semibold"
      const sizeClasses = "px-4 py-2"
      const variantClasses = "bg-blue-500 text-white"

      const result = cn(baseClasses, sizeClasses, variantClasses)

      expect(result).toContain("rounded-md")
      expect(result).toContain("font-semibold")
      expect(result).toContain("px-4")
      expect(result).toContain("py-2")
      expect(result).toContain("bg-blue-500")
      expect(result).toContain("text-white")
    })

    it("should handle dynamic classes with overrides", () => {
      const defaultClasses = "px-4 py-2 bg-gray-100"
      const overrideClasses = "px-6 bg-blue-500"

      const result = cn(defaultClasses, overrideClasses)

      expect(result).toBe("py-2 px-6 bg-blue-500")
    })

    it("should handle responsive classes", () => {
      const result = cn("text-sm", "md:text-base", "lg:text-lg")

      expect(result).toContain("text-sm")
      expect(result).toContain("md:text-base")
      expect(result).toContain("lg:text-lg")
    })

    it("should handle hover and focus states", () => {
      const result = cn(
        "bg-blue-500",
        "hover:bg-blue-600",
        "focus:ring-2",
        "focus:ring-blue-500"
      )

      expect(result).toContain("bg-blue-500")
      expect(result).toContain("hover:bg-blue-600")
      expect(result).toContain("focus:ring-2")
      expect(result).toContain("focus:ring-blue-500")
    })
  })

  describe("edge cases", () => {
    it("should handle whitespace in class names", () => {
      expect(cn("  px-2  ", "  py-1  ")).toBe("px-2 py-1")
    })

    it("should handle duplicate class names", () => {
      expect(cn("px-2", "px-2")).toBe("px-2")
    })

    it("should handle very long class strings", () => {
      const longClasses = Array(100)
        .fill("class")
        .map((c, i) => `${c}-${i}`)
        .join(" ")
      const result = cn(longClasses)
      expect(result).toBeTruthy()
      expect(result.length).toBeGreaterThan(0)
    })
  })
})