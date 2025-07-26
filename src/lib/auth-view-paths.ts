export const authViewPaths = {
    /** @default "accept-invitation" */
    ACCEPT_INVITATION: "accept-invitation",
    /** @default "api-keys" */
    API_KEYS: "api-keys",
    /** @default "callback" */
    CALLBACK: "callback",
    /** @default "email-otp" */
    EMAIL_OTP: "email-otp",
    /** @default "forgot-password" */
    FORGOT_PASSWORD: "forgot-password",
    /** @default "magic-link" */
    MAGIC_LINK: "magic-link",
    /** @default "members" */
    MEMBERS: "members",
    /** @default "organization" */
    ORGANIZATION: "organization",
    /** @default "organization-api-keys" */
    ORGANIZATION_API_KEYS: "organization-api-keys",
    /** @default "organizations" */
    ORGANIZATIONS: "organizations",
    /** @default "recover-account" */
    RECOVER_ACCOUNT: "recover-account",
    /** @default "reset-password" */
    RESET_PASSWORD: "reset-password",
    /** @default "security" */
    SECURITY: "security",
    /** @default "settings" */
    SETTINGS: "settings",
    /** @default "sign-in" */
    SIGN_IN: "sign-in",
    /** @default "sign-out" */
    SIGN_OUT: "sign-out",
    /** @default "sign-up" */
    SIGN_UP: "sign-up",
    /** @default "two-factor" */
    TWO_FACTOR: "two-factor"
}

export type AuthViewPaths = typeof authViewPaths
export type AuthView = keyof AuthViewPaths
