import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { AuthLocalization } from "./auth-localization"
import type { AuthView, AuthViewPaths} from "./auth-view-paths";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function isValidEmail(email: string) {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Converts error codes from SNAKE_CASE to camelCase
 * Example: INVALID_TWO_FACTOR_COOKIE -> invalidTwoFactorCookie
 */
export function errorCodeToCamelCase(errorCode: string): string {
    return errorCode.toLowerCase().replace(/_([a-z])/g, (_, char) => char.toUpperCase())
}

/**
 * Gets a localized error message from an error object
 */
export function getLocalizedError({
    error,
    localization
}: {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    error: any
    localization?: Partial<AuthLocalization>
}) {
    if (error?.error) {
        if (error.error.code) {
            const camelCaseErrorCode = errorCodeToCamelCase(
                error.error.code
            ) as keyof AuthLocalization
            if (localization?.[camelCaseErrorCode]) return localization[camelCaseErrorCode]
        }

        return (
            error.error.message ||
            error.error.code ||
            error.error.statusText ||
            localization?.requestFailed
        )
    }

    return error?.message || localization?.requestFailed || "Request failed"
}

export function getSearchParam(paramName: string) {
    return typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get(paramName)
        : null
}

export function getAuthViewPath(
    authViewPaths: AuthViewPaths,
    view?: string | undefined,
): AuthView | undefined {
    if (!view) {
        return undefined
    }

    if (view in authViewPaths) {
        return view as AuthView
    }
}

export function getKeyByValue<T extends Record<string, unknown>>(
    object: T,
    value?: T[keyof T]
): keyof T | undefined {
    return (Object.keys(object) as Array<keyof T>).find((key) => object[key] === value)
}