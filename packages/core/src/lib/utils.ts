function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === "object" && !Array.isArray(item)
}

export function deepmerge<T>(target: T, source: Partial<T>): T {
  if (isObject(target) && isObject(source)) {
    const result: Record<string, unknown> = { ...target }

    for (const [key, value] of Object.entries(source)) {
      if (value === undefined) continue // skip undefineds

      if (key in target) {
        result[key] = deepmerge(
          (target as Record<string, unknown>)[key],
          value as unknown as Partial<T>
        )
      } else {
        result[key] = value
      }
    }

    return result as T
  }

  return source as T
}
