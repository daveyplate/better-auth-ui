"use client"

import type { SocialProvider } from "better-auth/social-providers"
import {
    type ReactNode,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef
} from "react"
import { toast } from "sonner"

import { RecaptchaV3 } from "../components/captcha/recaptcha-v3"
import { useAuthData } from "../hooks/use-auth-data"
import {
    type AuthLocalization,
    authLocalization
} from "../localization/auth-localization"
import type { AdditionalFields } from "../types/additional-fields"
import type { AnyAuthClient } from "../types/any-auth-client"
import type { AuthClient } from "../types/auth-client"
import type { AuthHooks } from "../types/auth-hooks"
import type { AuthMutators } from "../types/auth-mutators"
import type { AvatarOptions } from "../types/avatar-options"
import type { CaptchaOptions } from "../types/captcha-options"
import type { CredentialsOptions } from "../types/credentials-options"
import type { DeleteUserOptions } from "../types/delete-user-options"
import type { GenericOAuthOptions } from "../types/generic-oauth-options"
import type { GravatarOptions } from "../types/gravatar-options"
import type { Link } from "../types/link"
import type {
    OrganizationOptions,
    OrganizationOptionsContext
} from "../types/organization-options"
import type { PasswordValidation } from "../types/password-validation"
import type { RenderToast } from "../types/render-toast"
import type { SettingsOptions } from "../types/settings-options"
import type { SignUpOptions } from "../types/sign-up-options"
import type { SocialOptions } from "../types/social-options"
import { type AuthViewPaths, authViewPaths } from "./auth-view-paths"
import type { Provider } from "./social-providers"
import { getLocalizedError, getSearchParam } from "./utils"

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
    authClient: AuthClient
    /**
     * Additional fields for users
     */
    additionalFields?: AdditionalFields
    /**
     * API Key plugin configuration
     */
    apiKey?:
        | {
              /**
               * Prefix for API Keys
               */
              prefix?: string
              /**
               * Metadata for API Keys
               */
              metadata?: Record<string, unknown>
          }
        | boolean
    /**
     * Avatar configuration
     * @default undefined
     */
    avatar?: AvatarOptions
    /**
     * Base path for the auth views
     * @default "/auth"
     */
    basePath: string
    /**
     * Front end base URL for auth API callbacks
     */
    baseURL?: string
    /**
     * Captcha configuration
     */
    captcha?: CaptchaOptions
    credentials?: CredentialsOptions
    /**
     * Default redirect URL after authenticating
     * @default "/"
     */
    redirectTo: string
    /**
     * Enable or disable user change email support
     * @default true
     */
    changeEmail?: boolean
    /**
     * User Account deletion configuration
     * @default undefined
     */
    deleteUser?: DeleteUserOptions
    /**
     * Show Verify Email card for unverified emails
     */
    emailVerification?: boolean
    /**
     * Freshness age for Session data
     * @default 60 * 60 * 24
     */
    freshAge: number
    /**
     * Generic OAuth provider configuration
     */
    genericOAuth?: GenericOAuthOptions
    /**
     * Gravatar configuration
     */
    gravatar?: boolean | GravatarOptions
    hooks: AuthHooks
    localization: AuthLocalization
    /**
     * Enable or disable Magic Link support
     * @default false
     */
    magicLink?: boolean
    /**
     * Enable or disable Email OTP support
     * @default false
     */
    emailOTP?: boolean
    /**
     * Enable or disable Multi Session support
     * @default false
     */
    multiSession?: boolean
    mutators: AuthMutators
    /**
     * Whether the name field should be required
     * @default true
     */
    nameRequired?: boolean
    /**
     * Enable or disable One Tap support
     * @default false
     */
    oneTap?: boolean
    /**
     * Perform some User updates optimistically
     * @default false
     */
    optimistic?: boolean
    organization?: OrganizationOptionsContext
    /**
     * Enable or disable Passkey support
     * @default false
     */
    passkey?: boolean
    /**
     * Forces better-auth-tanstack to refresh the Session on the auth callback page
     * @default false
     */
    persistClient?: boolean
    settings?: SettingsOptions
    /**
     * Sign Up configuration
     */
    signUp?: SignUpOptions
    /**
     * Social provider configuration
     */
    social?: SocialOptions
    toast: RenderToast
    /**
     * Enable or disable two-factor authentication support
     * @default undefined
     */
    twoFactor?: ("otp" | "totp")[]
    viewPaths: AuthViewPaths
    /**
     * Navigate to a new URL
     * @default window.location.href
     */
    navigate: typeof defaultNavigate
    /**
     * Called whenever the Session changes
     */
    onSessionChange?: () => void | Promise<void>
    /**
     * Replace the current URL
     * @default navigate
     */
    replace: typeof defaultReplace
    /**
     * Custom Link component for navigation
     * @default <a>
     */
    Link: Link
}

export type AuthUIProviderProps = {
    children: ReactNode
    /**
     * Better Auth client returned from createAuthClient
     * @default Required
     * @remarks `AuthClient`
     */
    authClient: AnyAuthClient
    /**
     * Avatar configuration
     * @default undefined
     */
    avatar?: boolean | Partial<AvatarOptions>
    /**
     * @deprecated use avatar.extension instead
     */
    avatarExtension?: string
    /**
     * @deprecated use avatar.size instead
     */
    avatarSize?: number
    /**
     * @deprecated use deleteUser.verification instead
     */
    deleteAccountVerification?: boolean
    /**
     * User Account deletion configuration
     * @default undefined
     */
    deleteUser?: DeleteUserOptions | boolean
    /**
     * ADVANCED: Custom hooks for fetching auth data
     */
    hooks?: Partial<AuthHooks>
    /**
     * Settings configuration
     * @default { fields: ["image", "name"] }
     */
    settings?: boolean | Partial<SettingsOptions>
    /**
     * @deprecated use settings.fields instead
     */
    settingsFields?: string[]
    /**
     * @deprecated use settings.url instead
     */
    settingsURL?: string
    /**
     * Customize the paths for the auth views
     * @default authViewPaths
     * @remarks `AuthViewPaths`
     */
    viewPaths?: Partial<AuthViewPaths>
    /**
     * Render custom Toasts
     * @default Sonner
     */
    toast?: RenderToast
    /**
     * Customize the Localization strings
     * @default authLocalization
     * @remarks `AuthLocalization`
     */
    localization?: AuthLocalization
    /**
     * ADVANCED: Custom mutators for updating auth data
     */
    mutators?: Partial<AuthMutators>
    /**
     * @deprecated use social.providers instead
     */
    providers?: SocialProvider[]
    /**
     * Organization plugin configuration
     */
    organization?: OrganizationOptions | boolean
    /**
     * @deprecated use genericOAuth.providers instead
     */
    otherProviders?: Provider[]
    /**
     * @deprecated use social.signIn instead
     */
    signInSocial?: (
        params: Parameters<AuthClient["signIn"]["social"]>[0]
    ) => Promise<unknown>
    /**
     * Enable or disable Credentials support
     * @default { forgotPassword: true }
     */
    credentials?: boolean | CredentialsOptions
    /**
     * @deprecated use credentials.confirmPassword instead
     */
    confirmPassword?: boolean
    /**
     * @deprecated use credentials.forgotPassword instead
     */
    forgotPassword?: boolean

    /**
     * @deprecated use credentials.passwordValidation instead
     */
    passwordValidation?: PasswordValidation
    /**
     * @deprecated use credentials.rememberMe instead
     */
    rememberMe?: boolean
    /**
     * @deprecated use avatar.upload instead
     */
    uploadAvatar?: (file: File) => Promise<string | undefined | null>
    /**
     * @deprecated use credentials.username instead
     */
    username?: boolean
    /**
     * Enable or disable Sign Up form
     * @default { fields: ["name"] }
     */
    signUp?: SignUpOptions | boolean
    /**
     * @deprecated use signUp.fields instead
     */
    signUpFields?: string[]
} & Partial<
    Omit<
        AuthUIContextType,
        | "authClient"
        | "viewPaths"
        | "localization"
        | "mutators"
        | "toast"
        | "hooks"
        | "avatar"
        | "settings"
        | "deleteUser"
        | "credentials"
        | "signUp"
        | "organization"
    >
>

export const AuthUIContext = createContext<AuthUIContextType>(
    {} as unknown as AuthUIContextType
)

export const AuthUIProvider = ({
    children,
    authClient: authClientProp,
    avatar: avatarProp,
    settings: settingsProp,
    settingsFields,
    settingsURL,
    avatarExtension,
    avatarSize,
    deleteUser: deleteUserProp,
    deleteAccountVerification,
    social: socialProp,
    genericOAuth: genericOAuthProp,
    providers,
    otherProviders,
    signInSocial,
    basePath = "/auth",
    baseURL = "",
    captcha,
    redirectTo = "/",
    credentials: credentialsProp,
    confirmPassword,
    forgotPassword,
    passwordValidation,
    rememberMe,
    username,
    changeEmail = true,
    freshAge = 60 * 60 * 24,
    hooks: hooksProp,
    mutators: mutatorsProp,
    localization: localizationProp,
    nameRequired = true,
    organization: organizationProp,
    signUp: signUpProp = true,
    signUpFields,
    toast = defaultToast,
    viewPaths: viewPathsProp,
    navigate,
    replace,
    uploadAvatar,
    Link = DefaultLink,
    ...props
}: AuthUIProviderProps) => {
    useEffect(() => {
        if (uploadAvatar !== undefined) {
            console.warn(
                "[Better Auth UI] uploadAvatar is deprecated, use avatar.upload instead"
            )
        }

        if (avatarExtension !== undefined) {
            console.warn(
                "[Better Auth UI] avatarExtension is deprecated, use avatar.extension instead"
            )
        }

        if (avatarSize !== undefined) {
            console.warn(
                "[Better Auth UI] avatarSize is deprecated, use avatar.size instead"
            )
        }

        if (settingsFields !== undefined) {
            console.warn(
                "[Better Auth UI] settingsFields is deprecated, use settings.fields instead"
            )
        }

        if (settingsURL !== undefined) {
            console.warn(
                "[Better Auth UI] settingsURL is deprecated, use settings.url instead"
            )
        }

        if (deleteAccountVerification !== undefined) {
            console.warn(
                "[Better Auth UI] deleteAccountVerification is deprecated, use deleteUser.verification instead"
            )
        }

        if (providers !== undefined) {
            console.warn(
                "[Better Auth UI] providers is deprecated, use social.providers instead"
            )
        }

        if (otherProviders !== undefined) {
            console.warn(
                "[Better Auth UI] otherProviders is deprecated, use genericOAuth.providers instead"
            )
        }

        if (signInSocial !== undefined) {
            console.warn(
                "[Better Auth UI] signInSocial is deprecated, use social.signIn instead"
            )
        }

        if (confirmPassword !== undefined) {
            console.warn(
                "[Better Auth UI] confirmPassword is deprecated, use credentials.confirmPassword instead"
            )
        }

        if (forgotPassword !== undefined) {
            console.warn(
                "[Better Auth UI] forgotPassword is deprecated, use credentials.forgotPassword instead"
            )
        }

        if (passwordValidation !== undefined) {
            console.warn(
                "[Better Auth UI] passwordValidation is deprecated, use credentials.passwordValidation instead"
            )
        }

        if (rememberMe !== undefined) {
            console.warn(
                "[Better Auth UI] rememberMe is deprecated, use credentials.rememberMe instead"
            )
        }

        if (username !== undefined) {
            console.warn(
                "[Better Auth UI] username is deprecated, use credentials.username instead"
            )
        }

        if (signUpFields !== undefined) {
            console.warn(
                "[Better Auth UI] signUpFields is deprecated, use signUp.fields instead"
            )
        }
    }, [
        uploadAvatar,
        avatarExtension,
        avatarSize,
        settingsFields,
        settingsURL,
        deleteAccountVerification,
        providers,
        otherProviders,
        signInSocial,
        confirmPassword,
        forgotPassword,
        passwordValidation,
        rememberMe,
        username,
        signUpFields
    ])

    const authClient = authClientProp as AuthClient

    const avatar = useMemo<AvatarOptions | undefined>(() => {
        if (!avatarProp) return

        if (avatarProp === true) {
            return {
                extension: avatarExtension || "png",
                size: avatarSize || (uploadAvatar ? 256 : 128),
                upload: uploadAvatar
            }
        }

        return {
            upload: avatarProp.upload || uploadAvatar,
            extension: avatarProp.extension || avatarExtension || "png",
            size: avatarProp.size || (avatarProp.upload ? 256 : 128)
        }
    }, [avatarProp, avatarExtension, avatarSize, uploadAvatar])

    const settings = useMemo<SettingsOptions | undefined>(() => {
        if (settingsProp === false) return

        if (settingsProp === true || settingsProp === undefined) {
            return {
                url: settingsURL,
                fields: settingsFields || ["image", "name"]
            }
        }

        // Remove trailing slash from basePath
        const basePath = settingsProp.basePath?.endsWith("/")
            ? settingsProp.basePath.slice(0, -1)
            : settingsProp.basePath

        return {
            url: settingsProp.url,
            basePath,
            fields: settingsProp.fields || ["image", "name"]
        }
    }, [settingsProp, settingsFields, settingsURL])

    const deleteUser = useMemo<DeleteUserOptions | undefined>(() => {
        if (!deleteUserProp) return

        if (deleteUserProp === true) {
            return {
                verification: deleteAccountVerification
            }
        }

        return deleteUserProp
    }, [deleteUserProp, deleteAccountVerification])

    const social = useMemo<SocialOptions | undefined>(() => {
        if (!socialProp && !providers) return

        if (providers) {
            return {
                providers: providers,
                signIn: signInSocial
            }
        }

        return socialProp
    }, [socialProp, providers, signInSocial])

    const genericOAuth = useMemo<GenericOAuthOptions | undefined>(() => {
        if (!genericOAuthProp && !otherProviders) return

        if (otherProviders) {
            return {
                providers: otherProviders
            }
        }

        return genericOAuthProp
    }, [genericOAuthProp, otherProviders])

    const credentials = useMemo<CredentialsOptions | undefined>(() => {
        if (credentialsProp === false) return

        if (credentialsProp === true) {
            return {
                confirmPassword,
                forgotPassword: forgotPassword ?? true,
                passwordValidation,
                rememberMe,
                username
            }
        }

        return {
            confirmPassword:
                credentialsProp?.confirmPassword || confirmPassword,
            forgotPassword:
                credentialsProp?.forgotPassword ?? forgotPassword ?? true,
            passwordValidation:
                credentialsProp?.passwordValidation || passwordValidation,
            rememberMe: credentialsProp?.rememberMe || rememberMe,
            username: credentialsProp?.username || username
        }
    }, [
        credentialsProp,
        confirmPassword,
        forgotPassword,
        passwordValidation,
        rememberMe,
        username
    ])

    const signUp = useMemo<SignUpOptions | undefined>(() => {
        if (signUpProp === false) return

        if (signUpProp === true || signUpProp === undefined) {
            return {
                fields: signUpFields || ["name"]
            }
        }

        return {
            fields: signUpProp.fields || signUpFields || ["name"]
        }
    }, [signUpProp, signUpFields])

    const organization = useMemo<OrganizationOptionsContext | undefined>(() => {
        if (!organizationProp) return

        if (organizationProp === true) {
            return {
                customRoles: []
            }
        }

        let logo: OrganizationOptionsContext["logo"] | undefined

        if (organizationProp.logo === true) {
            logo = {
                extension: "png",
                size: 128
            }
        } else if (organizationProp.logo) {
            logo = {
                upload: organizationProp.logo.upload,
                extension: organizationProp.logo.extension || "png",
                size:
                    organizationProp.logo.size || organizationProp.logo.upload
                        ? 256
                        : 128
            }
        }

        return {
            ...organizationProp,
            logo,
            customRoles: organizationProp.customRoles || []
        }
    }, [organizationProp])

    const defaultMutators = useMemo(() => {
        return {
            deleteApiKey: (params) =>
                authClient.apiKey.delete({
                    ...params,
                    fetchOptions: { throw: true }
                }),
            deletePasskey: (params) =>
                authClient.passkey.deletePasskey({
                    ...params,
                    fetchOptions: { throw: true }
                }),
            revokeDeviceSession: (params) =>
                authClient.multiSession.revoke({
                    ...params,
                    fetchOptions: { throw: true }
                }),
            revokeSession: (params) =>
                authClient.revokeSession({
                    ...params,
                    fetchOptions: { throw: true }
                }),
            setActiveSession: (params) =>
                authClient.multiSession.setActive({
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
        } as AuthMutators
    }, [authClient])

    const defaultHooks = useMemo(() => {
        return {
            useSession: authClient.useSession,
            useListAccounts: () =>
                useAuthData({
                    queryFn: authClient.listAccounts,
                    cacheKey: "listAccounts"
                }),
            useListDeviceSessions: () =>
                useAuthData({
                    queryFn: authClient.multiSession.listDeviceSessions,
                    cacheKey: "listDeviceSessions"
                }),
            useListSessions: () =>
                useAuthData({
                    queryFn: authClient.listSessions,
                    cacheKey: "listSessions"
                }),
            useListPasskeys: authClient.useListPasskeys,
            useListApiKeys: () =>
                useAuthData({
                    queryFn: authClient.apiKey.list,
                    cacheKey: "listApiKeys"
                }),
            useActiveOrganization: authClient.useActiveOrganization,
            useListOrganizations: authClient.useListOrganizations,
            useHasPermission: (params) =>
                useAuthData({
                    queryFn: () =>
                        authClient.organization.hasPermission(params),
                    cacheKey: `hasPermission:${JSON.stringify(params)}`
                }),
            useInvitation: (params) =>
                useAuthData({
                    queryFn: () =>
                        authClient.organization.getInvitation(params),
                    cacheKey: `invitation:${JSON.stringify(params)}`
                })
        } as AuthHooks
    }, [authClient])

    const viewPaths = useMemo(() => {
        return { ...authViewPaths, ...viewPathsProp } as AuthViewPaths
    }, [viewPathsProp])

    const localization = useMemo(() => {
        return { ...authLocalization, ...localizationProp } as AuthLocalization
    }, [localizationProp])

    const hooks = useMemo(() => {
        return { ...defaultHooks, ...hooksProp } as AuthHooks
    }, [defaultHooks, hooksProp])

    const mutators = useMemo(() => {
        return { ...defaultMutators, ...mutatorsProp } as AuthMutators
    }, [defaultMutators, mutatorsProp])

    // Remove trailing slash from baseURL
    baseURL = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL

    // Remove trailing slash from basePath
    basePath = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath

    const { data: sessionData } = hooks.useSession()

    const errorShown = useRef(false)
    useEffect(() => {
        if (errorShown.current) return

        const error = getSearchParam("error")
        if (error) {
            errorShown.current = true
            console.log({ error })
            toast({
                variant: "error",
                message: getLocalizedError({ error, localization })
            })
        }
    }, [localization, toast])

    return (
        <AuthUIContext.Provider
            value={{
                authClient,
                avatar,
                basePath: basePath === "/" ? "" : basePath,
                baseURL,
                captcha,
                redirectTo,
                changeEmail,
                credentials,
                deleteUser,
                freshAge,
                genericOAuth,
                hooks,
                mutators,
                localization,
                nameRequired,
                organization,
                settings,
                signUp,
                social,
                toast,
                navigate: navigate || defaultNavigate,
                replace: replace || navigate || defaultReplace,
                viewPaths,
                Link,
                ...props
            }}
        >
            {sessionData &&
                organization &&
                (hooks.useActiveOrganization ===
                    authClient.useActiveOrganization ||
                    hooks.useListOrganizations ===
                        authClient.useListOrganizations) && (
                    <OrganizationRefetcher />
                )}
            {captcha?.provider === "google-recaptcha-v3" ? (
                <RecaptchaV3>{children}</RecaptchaV3>
            ) : (
                children
            )}
        </AuthUIContext.Provider>
    )
}

const OrganizationRefetcher = () => {
    const { hooks } = useContext(AuthUIContext)
    const { data: sessionData } = hooks.useSession()
    const { data: activeOrganization, refetch: refetchActiveOrganization } =
        hooks.useActiveOrganization()
    const { data: organizations, refetch: refetchListOrganizations } =
        hooks.useListOrganizations()

    // biome-ignore lint/correctness/useExhaustiveDependencies: Refetch fix
    useEffect(() => {
        if (!sessionData?.user.id) return
        if (activeOrganization) refetchActiveOrganization?.()
        if (organizations) refetchListOrganizations?.()
    }, [
        sessionData?.user.id,
        refetchActiveOrganization,
        refetchListOrganizations
    ])

    return null
}
