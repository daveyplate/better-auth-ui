"use client"

import { useContext, useEffect } from "react"

import { AuthUIContext } from "../../lib/auth-ui-provider"
import type { AuthView } from "../../lib/auth-view-paths"
import { getAuthViewByPath } from "../../lib/utils"
import type { AuthLocalization } from "../../localization/auth-localization"
import { AuthCallback } from "./auth-callback"
import { EmailOTPForm } from "./forms/email-otp-form"
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
        emailOTP,
        signUp,
        twoFactor: twoFactorEnabled,
        viewPaths,
        replace
    } = useContext(AuthUIContext)

    const signUpEnabled = !!signUp

    localization = { ...contextLocalization, ...localization }

    const path = pathname?.split("/").pop()

    useEffect(() => {
        if (path && !getAuthViewByPath(viewPaths, path)) {
            console.error(`Invalid auth view: ${path}`)
            replace(`${basePath}/${viewPaths.SIGN_IN}${window.location.search}`)
        }
    }, [path, viewPaths, basePath, replace])

    view = view || getAuthViewByPath(viewPaths, path) || "SIGN_IN"

    // Redirect to appropriate view based on enabled features
    useEffect(() => {
        let isInvalidView = false

        if (
            view === "MAGIC_LINK" &&
            (!magicLink || (!credentials && !emailOTP))
        ) {
            isInvalidView = true
        }

        if (
            view === "EMAIL_OTP" &&
            (!emailOTP || (!credentials && !magicLink))
        ) {
            isInvalidView = true
        }

        if (view === "SIGN_UP" && !signUpEnabled) {
            isInvalidView = true
        }

        if (
            !credentials &&
            [
                "SIGN_UP",
                "FORGOT_PASSWORD",
                "RESET_PASSWORD",
                "TWO_FACTOR",
                "RECOVER_ACCOUNT"
            ].includes(view)
        ) {
            isInvalidView = true
        }

        if (
            ["TWO_FACTOR", "RECOVER_ACCOUNT"].includes(view) &&
            !twoFactorEnabled
        ) {
            isInvalidView = true
        }

        if (isInvalidView) {
            replace(`${basePath}/${viewPaths.SIGN_IN}${window.location.search}`)
        }
    }, [
        basePath,
        view,
        viewPaths,
        credentials,
        replace,
        emailOTP,
        signUpEnabled,
        magicLink,
        twoFactorEnabled
    ])

    if (view === "SIGN_OUT") return <SignOut />
    if (view === "CALLBACK") return <AuthCallback redirectTo={redirectTo} />

    if (view === "SIGN_IN") {
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
        ) : emailOTP ? (
            <EmailOTPForm
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

    if (view === "TWO_FACTOR") {
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

    if (view === "RECOVER_ACCOUNT") {
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

    if (view === "MAGIC_LINK") {
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

    if (view === "EMAIL_OTP") {
        return (
            <EmailOTPForm
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

    if (view === "FORGOT_PASSWORD") {
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

    if (view === "RESET_PASSWORD") {
        return (
            <ResetPasswordForm
                className={className}
                classNames={classNames}
                localization={localization}
            />
        )
    }

    if (view === "SIGN_UP") {
        return (
            signUpEnabled && (
                <SignUpForm
                    className={className}
                    classNames={classNames}
                    callbackURL={callbackURL}
                    localization={localization}
                    redirectTo={redirectTo}
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                />
            )
        )
    }
}
