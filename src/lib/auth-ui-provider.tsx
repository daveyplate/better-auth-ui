"use client"

import type { createAuthClient } from "better-auth/react"
import { ReactNode, createContext } from "react"

import type { SocialProvider } from "../social-providers"

const DefaultLink = (
    { href, className, children }: { href: string, className?: string, children: ReactNode }
) => (
    <a className={className} href={href} >
        {children}
    </a>
)

const defaultNavigate = (href: string) => { window.location.href = href }

export type Link = React.ComponentType<{ href: string, to: unknown, className?: string, children: ReactNode }>

export const authViewPaths = {
    forgotPassword: "forgot-password",
    magicLink: "magic-link",
    resetPassword: "reset-password",
    signIn: "sign-in",
    signOut: "sign-out",
    signUp: "sign-up",
}

export type AuthView = keyof typeof authViewPaths

export type AuthUIContextType = {
    authClient: Omit<ReturnType<typeof createAuthClient>, "signUp">
    basePath: string
    colorIcons?: boolean
    credentials?: boolean
    deleteAccountVerification?: boolean
    deleteUser?: boolean
    forgotPassword?: boolean
    magicLink?: boolean
    multiSession?: boolean
    noColorIcons?: boolean
    passkey?: boolean
    providers?: SocialProvider[]
    settingsUrl?: string
    username?: boolean
    viewPaths: typeof authViewPaths
    navigate: typeof defaultNavigate
    LinkComponent: Link
}

export type AuthUIProviderProps = {
    authClient: ReturnType<typeof createAuthClient>
    viewPaths?: Partial<typeof authViewPaths>
} & Partial<Omit<AuthUIContextType, "viewPaths">>

export const AuthUIContext = createContext<AuthUIContextType>({} as unknown as AuthUIContextType)

export const AuthUIProvider = ({
    children,
    basePath = "/auth",
    credentials = true,
    forgotPassword = true,
    viewPaths,
    navigate = defaultNavigate,
    LinkComponent = DefaultLink,
    ...props
}: {
    children: ReactNode
} & AuthUIProviderProps) => {
    return (
        <AuthUIContext.Provider
            value={{
                basePath,
                credentials,
                forgotPassword,
                navigate,
                viewPaths: { ...authViewPaths, ...viewPaths },
                LinkComponent,
                ...props
            }}
        >
            {children}
        </AuthUIContext.Provider>
    )
}