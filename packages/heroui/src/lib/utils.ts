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
