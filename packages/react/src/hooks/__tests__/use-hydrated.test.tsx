import { describe, expect, it } from "vitest"
import { renderHook } from "@testing-library/react"
import { useHydrated } from "../use-hydrated"

describe("useHydrated", () => {
  it("should return a boolean value", () => {
    const { result } = renderHook(() => useHydrated())
    expect(typeof result.current).toBe("boolean")
  })

  it("should return true when rendered on client", () => {
    const { result } = renderHook(() => useHydrated())
    expect(result.current).toBe(true)
  })

  it("should remain stable across re-renders", () => {
    const { result, rerender } = renderHook(() => useHydrated())
    const firstValue = result.current

    rerender()
    expect(result.current).toBe(firstValue)

    rerender()
    expect(result.current).toBe(firstValue)
  })

  it("should not cause re-renders when value changes", () => {
    let renderCount = 0
    const { rerender } = renderHook(() => {
      renderCount++
      return useHydrated()
    })

    const initialRenderCount = renderCount
    rerender()

    // Only one additional render (from the explicit rerender)
    expect(renderCount).toBe(initialRenderCount + 1)
  })

  it("should work in multiple hook instances independently", () => {
    const { result: result1 } = renderHook(() => useHydrated())
    const { result: result2 } = renderHook(() => useHydrated())

    expect(result1.current).toBe(result2.current)
    expect(result1.current).toBe(true)
    expect(result2.current).toBe(true)
  })

  it("should be synchronous", () => {
    let hydrated: boolean | undefined

    renderHook(() => {
      hydrated = useHydrated()
    })

    expect(hydrated).toBeDefined()
    expect(typeof hydrated).toBe("boolean")
  })
})