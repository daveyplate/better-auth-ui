export const authViewPaths = {
    /** @default "callback" */
    callback: "callback",
    /** @default "forgot-password" */
    forgotPassword: "forgot-password",
    /** @default "magic-link" */
    magicLink: "magic-link",
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
    twoFactorPrompt: "two-factor",
    /** @default "two-factor-setup" */
    twoFactorSetup: "two-factor-setup"
}

export type AuthViewPaths = typeof authViewPaths
export type AuthView = keyof typeof authViewPaths
