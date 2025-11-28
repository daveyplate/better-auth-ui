import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Compose and merge class names for Tailwind CSS.
 *
 * @param inputs - Class name values (strings, arrays, objects, or other values); falsy values are ignored.
 * @returns The final merged class string with Tailwind utility conflicts resolved.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === "object" && !Array.isArray(item)
}

export function deepmerge<T>(target: T, source: Partial<T>): T {
  if (Array.isArray(target) && Array.isArray(source)) {
    // merge arrays by concatenation
    return [...target, ...source] as T
  } else if (isObject(target) && isObject(source)) {
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

  // primitives and fallback: source overrides target
  return source as T
}
