"use client"

import { useContext, useEffect } from "react"

import type { AuthLocalization } from "../../lib/auth-localization"
import { AuthUIContext } from "../../lib/auth-ui-provider"
import type { AuthView } from "../../lib/auth-view-paths"
import { getAuthViewPath } from "../../lib/utils"
import { AuthCallback } from "./auth-callback"
import { ForgotPasswordForm } from "./forms/forgot-password-form"
import { MagicLinkForm } from "./forms/magic-link-form"
import { RecoverAccountForm } from "./forms/recover-account-form"
import { ResetPasswordForm } from "./forms/reset-password-form"
import { SignInForm } from "./forms/sign-in-form"
import { SignUpForm } from "./forms/sign-up-form"
import { TwoFactorForm } from "./forms/two-factor-form"
import { SignOut } from "./sign-out"

export type AuthFormClassNames = {
    base?: string
    button?: string
    checkbox?: string
    description?: string
    error?: string
    forgotPasswordLink?: string
    icon?: string
    input?: string
    label?: string
    otpInput?: string
    otpInputContainer?: string
    outlineButton?: string
    primaryButton?: string
    providerButton?: string
    qrCode?: string
    secondaryButton?: string
}

export interface AuthFormProps {
    className?: string
    classNames?: AuthFormClassNames
    callbackURL?: string
    isSubmitting?: boolean
    localization?: Partial<AuthLocalization>
    pathname?: string
    redirectTo?: string
    view?: AuthView
    otpSeparators?: 0 | 1 | 2
    setIsSubmitting?: (isSubmitting: boolean) => void
}

export function AuthForm({
    className,
    classNames,
    callbackURL,
    isSubmitting,
    localization,
    pathname,
    redirectTo,
    view,
    otpSeparators = 0,
    setIsSubmitting
}: AuthFormProps) {
    const {
        basePath,
        credentials,
        localization: contextLocalization,
        magicLink,
        signUp: signUpEnabled,
        twoFactor: twoFactorEnabled,
        viewPaths,
        replace
    } = useContext(AuthUIContext)

    localization = { ...contextLocalization, ...localization }

    const path = pathname?.split("/").pop()

    useEffect(() => {
        if (path && !getAuthViewPath(viewPaths, path)) {
            console.error(`Invalid auth view: ${path}`)
            replace(`${basePath}/${viewPaths.signIn}${window.location.search}`)
        }
    }, [path, viewPaths, basePath, replace])

    view = view || getAuthViewPath(viewPaths, path) || "signIn"

    // Redirect to appropriate view based on enabled features
    useEffect(() => {
        let isInvalidView = false

        if (view === "magicLink" && (!magicLink || !credentials)) {
            isInvalidView = true
        }

        if (view === "signUp" && !signUpEnabled) {
            isInvalidView = true
        }

        if (
            !credentials &&
            ["signUp", "forgotPassword", "resetPassword", "twoFactor", "recoverAccount"].includes(
                view
            )
        ) {
            isInvalidView = true
        }

        if (["twoFactor", "recoverAccount"].includes(view) && !twoFactorEnabled) {
            isInvalidView = true
        }

        if (isInvalidView) {
            replace(`${basePath}/${viewPaths.signIn}${window.location.search}`)
        }
    }, [
        basePath,
        view,
        viewPaths,
        credentials,
        replace,
        signUpEnabled,
        magicLink,
        twoFactorEnabled
    ])

    if (view === "signOut") return <SignOut />
    if (view === "callback") return <AuthCallback redirectTo={redirectTo} />

    if (view === "signIn") {
        return credentials ? (
            <SignInForm
                className={className}
                classNames={classNames}
                localization={localization}
                redirectTo={redirectTo}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />
        ) : magicLink ? (
            <MagicLinkForm
                className={className}
                classNames={classNames}
                callbackURL={callbackURL}
                localization={localization}
                redirectTo={redirectTo}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />
        ) : null
    }

    if (view === "twoFactor") {
        return (
            <TwoFactorForm
                className={className}
                classNames={classNames}
                localization={localization}
                otpSeparators={otpSeparators}
                redirectTo={redirectTo}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />
        )
    }

    if (view === "recoverAccount") {
        return (
            <RecoverAccountForm
                className={className}
                classNames={classNames}
                localization={localization}
                redirectTo={redirectTo}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />
        )
    }

    if (view === "magicLink") {
        return (
            <MagicLinkForm
                className={className}
                classNames={classNames}
                callbackURL={callbackURL}
                localization={localization}
                redirectTo={redirectTo}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />
        )
    }

    if (view === "forgotPassword") {
        return (
            <ForgotPasswordForm
                className={className}
                classNames={classNames}
                localization={localization}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />
        )
    }

    if (view === "resetPassword") {
        return (
            <ResetPasswordForm
                className={className}
                classNames={classNames}
                localization={localization}
            />
        )
    }

    if (view === "signUp") {
        return (
            <SignUpForm
                className={className}
                classNames={classNames}
                localization={localization}
                redirectTo={redirectTo}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />
        )
    }
}
