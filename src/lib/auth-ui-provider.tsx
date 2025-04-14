"use client"
import type { SocialProvider } from "better-auth/social-providers"
import { type ReactNode, createContext } from "react"
import { toast } from "sonner"

import { useAuthData } from "../hooks/use-auth-data"
import type { AdditionalFields } from "../types/additional-fields"
import type { AnyAuthClient } from "../types/any-auth-client"
import type { AuthClient } from "../types/auth-client"
import type { AuthHooks } from "../types/auth-hooks"
import type { AuthMutators } from "../types/auth-mutators"
import type { Link } from "../types/link"
import type { RenderToast } from "../types/render-toast"
import { type AuthLocalization, authLocalization } from "./auth-localization"
import { type AuthViewPaths, authViewPaths } from "./auth-view-paths"
import type { Provider } from "./social-providers"

const DefaultLink: Link = ({ href, className, children }) => (
    <a className={className} href={href}>
        {children}
    </a>
)

const defaultNavigate = (href: string) => {
    window.location.href = href
}

const defaultReplace = (href: string) => {
    window.location.replace(href)
}

const defaultToast: RenderToast = ({ variant = "default", message }) => {
    if (variant === "default") {
        toast(message)
    } else {
        toast[variant](message)
    }
}

export type AuthUIContextType = {
    authClient: AnyAuthClient
    /**
     * Additional fields for users
     */
    additionalFields?: AdditionalFields
    /**
     * Enable or disable avatar support
     * @default false
     */
    avatar?: boolean
    /**
     * File extension for avatar uploads
     * @default "png"
     */
    avatarExtension: string
    /**
     * Avatars are resized to 128px unless uploadAvatar is provided, then 256px
     * @default 128 | 256
     */
    avatarSize: number
    /**
     * Base path for the auth views
     * @default "/auth"
     */
    basePath: string
    /**
     * Base URL for auth client callbacks
     */
    baseURL?: string
    /**
     * Force color icons for both light and dark themes
     * @default false
     */
    colorIcons?: boolean
    /**
     * Enable or disable confirm password input
     * @default false
     */
    confirmPassword?: boolean
    /**
     * Enable or disable credentials support
     * @default true
     */
    credentials?: boolean
    /**
     * Default redirect path after sign in
     * @default "/"
     */
    redirectTo: string
    /**
     * Enable or disable email verification for account deletion
     * @default false
     */
    deleteAccountVerification?: boolean
    /**
     * Enable or disable user account deletion
     * @default false
     */
    deleteUser?: boolean
    /**
     * Show verify email card for unverified emails
     */
    emailVerification?: boolean
    /**
     * Enable or disable forgot password support
     * @default false
     */
    forgotPassword?: boolean
    /**
     * Freshness age for session data
     * @default 60 * 60 * 24
     */
    freshAge: number
    /**
     * @internal
     */
    hooks: AuthHooks
    localization: AuthLocalization
    /**
     * Enable or disable magic link support
     * @default false
     */
    magicLink?: boolean
    /**
     * Enable or disable multi-session support
     * @default false
     */
    multiSession?: boolean
    /** @internal */
    mutators: AuthMutators
    /**
     * Enable or disable name requirement for sign up
     * @default true
     */
    nameRequired?: boolean
    /**
     * Force black & white icons for both light and dark themes
     * @default false
     */
    noColorIcons?: boolean
    /**
     * Perform some user updates optimistically
     * @default false
     */
    optimistic?: boolean
    /**
     * Enable or disable passkey support
     * @default false
     */
    passkey?: boolean
    /**
     * Enable or disable two-factor authentication support
     * @default false
     */
    twoFactor?: boolean
    /**
     * Enable or disable persisting the client with better-auth-tanstack
     * @default false
     */
    persistClient?: boolean
    /**
     * Array of social providers to enable
     * @remarks `SocialProvider[]`
     */
    providers?: SocialProvider[]
    /**
     * Custom OAuth Providers
     * @default false
     */
    otherProviders?: Provider[]
    /**
     * Enable or disable remember me support
     * @default false
     */
    rememberMe?: boolean
    /**
     * Array of fields to show in `<SettingsCards />`
     * @default ["name"]
     */
    settingsFields?: string[]
    /**
     * Custom settings URL
     */
    settingsUrl?: string
    /**
     * Enable or disable sign up support
     * @default true
     */
    signUp?: boolean
    /**
     * Array of fields to show in Sign Up form
     * @default ["name"]
     */
    signUpFields?: string[]
    toast: RenderToast
    /**
     * Enable or disable username support
     * @default false
     */
    username?: boolean
    viewPaths: AuthViewPaths
    /**
     * Navigate to a new URL
     * @default window.location.href
     */
    navigate: typeof defaultNavigate
    /**
     * Called whenever the session changes
     */
    onSessionChange?: () => void | Promise<void>
    /**
     * Replace the current URL
     * @default navigate
     */
    replace: typeof defaultReplace
    /**
     * Upload an avatar image and return the URL string
     * @remarks `(file: File) => Promise<string>`
     */
    uploadAvatar?: (file: File) => Promise<string | undefined | null>
    /**
     * Custom link component for navigation
     * @default <a>
     */
    Link: Link
}

export type AuthUIProviderProps = {
    children: ReactNode
    /**
     * Your better-auth createAuthClient
     * @default Required
     * @remarks `AuthClient`
     */
    authClient: AnyAuthClient
    /**
     * ADVANCED: Custom hooks for fetching auth data
     */
    hooks?: Partial<AuthHooks>
    /**
     * Customize the paths for the auth views
     * @default authViewPaths
     * @remarks `AuthViewPaths`
     */
    viewPaths?: Partial<AuthViewPaths>
    /**
     * Render custom toasts
     * @default Sonner
     */
    toast?: RenderToast
    /**
     * Customize the localization strings
     * @default authLocalization
     * @remarks `AuthLocalization`
     */
    localization?: AuthLocalization
    /**
     * ADVANCED: Custom mutators for updating auth data
     */
    mutators?: Partial<AuthMutators>
} & Partial<Omit<AuthUIContextType, "viewPaths" | "localization" | "mutators" | "toast" | "hooks">>

export const AuthUIContext = createContext<AuthUIContextType>({} as unknown as AuthUIContextType)

export const AuthUIProvider = ({
    children,
    authClient,
    avatarExtension = "png",
    avatarSize,
    basePath = "/auth",
    baseURL = "",
    redirectTo = "/",
    credentials = true,
    forgotPassword = true,
    freshAge = 60 * 60 * 24,
    hooks,
    mutators,
    localization,
    nameRequired = true,
    passkey,
    twoFactor,
    settingsFields = ["name"],
    signUp = true,
    signUpFields = ["name"],
    toast = defaultToast,
    viewPaths,
    navigate,
    replace,
    uploadAvatar,
    Link = DefaultLink,
    ...props
}: AuthUIProviderProps) => {
    const defaultMutates: AuthMutators = {
        deletePasskey: (params) =>
            (authClient as AuthClient).passkey.deletePasskey({
                ...params,
                fetchOptions: { throw: true }
            }),
        revokeDeviceSession: (params) =>
            (authClient as AuthClient).multiSession.revoke({
                ...params,
                fetchOptions: { throw: true }
            }),
        revokeSession: (params) =>
            (authClient as AuthClient).revokeSession({
                ...params,
                fetchOptions: { throw: true }
            }),
        setActiveSession: (params) =>
            (authClient as AuthClient).multiSession.setActive({
                ...params,
                fetchOptions: { throw: true }
            }),
        updateUser: (params) =>
            authClient.updateUser({
                ...params,
                fetchOptions: { throw: true }
            }),
        unlinkAccount: (params) =>
            authClient.unlinkAccount({
                ...params,
                fetchOptions: { throw: true }
            })
    }

    const defaultHooks: AuthHooks = {
        useSession: authClient.useSession,
        useListAccounts: () => useAuthData({ queryFn: authClient.listAccounts }),
        useListDeviceSessions: () =>
            useAuthData({ queryFn: (authClient as AuthClient).multiSession.listDeviceSessions }),
        useListSessions: () => useAuthData({ queryFn: authClient.listSessions }),
        useListPasskeys: (authClient as AuthClient).useListPasskeys
    }

    return (
        <AuthUIContext.Provider
            value={{
                authClient,
                avatarExtension,
                avatarSize: avatarSize || (uploadAvatar ? 256 : 128),
                basePath: basePath === "/" ? "" : basePath,
                baseURL,
                redirectTo,
                credentials,
                forgotPassword,
                freshAge,
                hooks: { ...defaultHooks, ...hooks },
                mutators: { ...defaultMutates, ...mutators },
                localization: { ...authLocalization, ...localization },
                nameRequired,
                settingsFields,
                signUp,
                signUpFields,
                toast,
                navigate: navigate || defaultNavigate,
                replace: replace || navigate || defaultReplace,
                viewPaths: { ...authViewPaths, ...viewPaths },
                uploadAvatar,
                Link,
                twoFactor,
                ...props
            }}
        >
            {children}
        </AuthUIContext.Provider>
    )
}
