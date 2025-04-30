export const authViewPaths = {
    /** @default "callback" */
    callback: "callback",
    /** @default "forgot-password" */
    forgotPassword: "forgot-password",
    /** @default "magic-link" */
    magicLink: "magic-link",
    /** @default "recover-account" */
    recoverAccount: "recover-account",
    /** @default "reset-password" */
    resetPassword: "reset-password",
    /** @default "settings" */
    settings: "settings",
    /** @default "sign-in" */
    signIn: "sign-in",
    /** @default "sign-out" */
    signOut: "sign-out",
    /** @default "sign-up" */
    signUp: "sign-up",
    /** @default "two-factor" */
    twoFactor: "two-factor"
} as const

export type AuthViewPaths = typeof authViewPaths
export type AuthView = keyof AuthViewPaths
