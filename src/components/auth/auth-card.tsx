"use client"

import { ArrowLeftIcon, Loader2 } from "lucide-react"
import { type ReactNode, useContext, useEffect, useState } from "react"

import { useIsHydrated } from "../../hooks/use-hydrated"
import { AuthUIContext } from "../../lib/auth-ui-provider"
import type { AuthView } from "../../lib/auth-view-paths"
import { socialProviders } from "../../lib/social-providers"
import { cn, getAuthViewByPath } from "../../lib/utils"
import type { AuthLocalization } from "../../localization/auth-localization"
import { AcceptInvitationCard } from "../organization/accept-invitation-card"
import {
    SettingsCards,
    type SettingsCardsClassNames,
    type SettingsView,
    settingsViews
} from "../settings/settings-cards"
import { Button } from "../ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "../ui/card"
import { Separator } from "../ui/separator"
import { AuthCallback } from "./auth-callback"
import { AuthForm, type AuthFormClassNames } from "./auth-form"
import { EmailOTPButton } from "./email-otp-button"
import { MagicLinkButton } from "./magic-link-button"
import { OneTap } from "./one-tap"
import { PasskeyButton } from "./passkey-button"
import { ProviderButton } from "./provider-button"
import { SignOut } from "./sign-out"

export interface AuthCardClassNames {
    base?: string
    content?: string
    description?: string
    footer?: string
    footerLink?: string
    continueWith?: string
    form?: AuthFormClassNames
    header?: string
    separator?: string
    settings?: SettingsCardsClassNames
    title?: string
}

export interface AuthCardProps {
    className?: string
    classNames?: AuthCardClassNames
    callbackURL?: string
    cardHeader?: ReactNode
    /**
     * @default authLocalization
     * @remarks `AuthLocalization`
     */
    localization?: AuthLocalization
    pathname?: string
    redirectTo?: string
    /**
     * @default "auto"
     */
    socialLayout?: "auto" | "horizontal" | "grid" | "vertical"
    /**
     * @remarks `AuthView`
     */
    view?: AuthView
    /**
     * @default 0
     */
    otpSeparators?: 0 | 1 | 2
}

export function AuthCard({
    className,
    classNames,
    callbackURL,
    cardHeader,
    localization,
    pathname,
    redirectTo,
    socialLayout = "auto",
    view,
    otpSeparators = 0
}: AuthCardProps) {
    const isHydrated = useIsHydrated()

    const {
        basePath,
        credentials,
        localization: contextLocalization,
        magicLink,
        emailOTP,
        oneTap,
        passkey,
        settings,
        signUp,
        social,
        genericOAuth,
        viewPaths,
        replace,
        Link
    } = useContext(AuthUIContext)

    localization = { ...contextLocalization, ...localization }

    if (socialLayout === "auto") {
        socialLayout = !credentials
            ? "vertical"
            : social?.providers && social.providers.length > 2
              ? "horizontal"
              : "vertical"
    }

    const path = pathname?.split("/").pop()
    view = view || getAuthViewByPath(viewPaths, path) || "SIGN_IN"

    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const handlePageHide = () => {
            setIsSubmitting(false)
        }

        window.addEventListener("pagehide", handlePageHide)

        return () => {
            setIsSubmitting(false)
            window.removeEventListener("pagehide", handlePageHide)
        }
    }, [])

    useEffect(() => {
        if (view === "SETTINGS" && settings?.url) replace(settings.url)
        if (view === "SETTINGS" && !settings) replace(redirectTo || "/")

        // Handle basePath redirects for settings views
        if (
            settings?.basePath &&
            settingsViews.includes(view as SettingsView)
        ) {
            const viewPath = viewPaths[view as keyof typeof viewPaths]
            const redirectPath = `${settings.basePath}/${viewPath}`

            replace(redirectPath)
        }
    }, [replace, settings, view, redirectTo, viewPaths])

    if (view === "CALLBACK") return <AuthCallback redirectTo={redirectTo} />
    if (view === "SIGN_OUT") return <SignOut />

    if (view === "ACCEPT_INVITATION")
        return (
            <AcceptInvitationCard
                className={className}
                classNames={classNames}
                localization={localization}
            />
        )

    if (settingsViews.includes(view as SettingsView))
        return !settings || settings.url ? (
            <Loader2 className="animate-spin" />
        ) : (
            <SettingsCards
                className={cn(className)}
                classNames={classNames?.settings}
                localization={localization}
                view={view as SettingsView}
            />
        )

    const description =
        !credentials && !magicLink && !emailOTP
            ? localization.DISABLED_CREDENTIALS_DESCRIPTION
            : localization[`${view}_DESCRIPTION` as keyof typeof localization]

    return (
        <Card className={cn("w-full max-w-sm", className, classNames?.base)}>
            <CardHeader className={classNames?.header}>
                {cardHeader ? (
                    cardHeader
                ) : (
                    <>
                        <CardTitle
                            className={cn(
                                "text-lg md:text-xl",
                                classNames?.title
                            )}
                        >
                            {localization[view as keyof typeof localization]}
                        </CardTitle>

                        {description && (
                            <CardDescription
                                className={cn(
                                    "text-xs md:text-sm",
                                    classNames?.description
                                )}
                            >
                                {description}
                            </CardDescription>
                        )}
                    </>
                )}
            </CardHeader>

            <CardContent className={cn("grid gap-6", classNames?.content)}>
                {oneTap &&
                    ["SIGN_IN", "SIGN_UP", "MAGIC_LINK", "EMAIL_OTP"].includes(
                        view
                    ) && (
                        <OneTap
                            localization={localization}
                            redirectTo={redirectTo}
                        />
                    )}

                {(credentials || magicLink || emailOTP) && (
                    <div className="grid gap-4">
                        <AuthForm
                            classNames={classNames?.form}
                            callbackURL={callbackURL}
                            isSubmitting={isSubmitting}
                            localization={localization}
                            otpSeparators={otpSeparators}
                            pathname={pathname}
                            redirectTo={redirectTo}
                            setIsSubmitting={setIsSubmitting}
                        />

                        {magicLink &&
                            ((credentials &&
                                [
                                    "FORGOT_PASSWORD",
                                    "SIGN_UP",
                                    "SIGN_IN",
                                    "MAGIC_LINK",
                                    "EMAIL_OTP"
                                ].includes(view)) ||
                                (emailOTP && view === "EMAIL_OTP")) && (
                                <MagicLinkButton
                                    classNames={classNames}
                                    localization={localization}
                                    view={view}
                                    isSubmitting={isSubmitting}
                                />
                            )}

                        {emailOTP &&
                            ((credentials &&
                                [
                                    "FORGOT_PASSWORD",
                                    "SIGN_UP",
                                    "SIGN_IN",
                                    "MAGIC_LINK",
                                    "EMAIL_OTP"
                                ].includes(view)) ||
                                (magicLink &&
                                    ["SIGN_IN", "MAGIC_LINK"].includes(
                                        view
                                    ))) && (
                                <EmailOTPButton
                                    classNames={classNames}
                                    localization={localization}
                                    view={view}
                                    isSubmitting={isSubmitting}
                                />
                            )}
                    </div>
                )}

                {view !== "RESET_PASSWORD" &&
                    (social?.providers?.length ||
                        genericOAuth?.providers?.length ||
                        (view === "SIGN_IN" && passkey)) && (
                        <>
                            {(credentials || magicLink || emailOTP) && (
                                <div
                                    className={cn(
                                        "flex items-center gap-2",
                                        classNames?.continueWith
                                    )}
                                >
                                    <Separator
                                        className={cn(
                                            "!w-auto grow",
                                            classNames?.separator
                                        )}
                                    />

                                    <span className="flex-shrink-0 text-muted-foreground text-sm">
                                        {localization.OR_CONTINUE_WITH}
                                    </span>

                                    <Separator
                                        className={cn(
                                            "!w-auto grow",
                                            classNames?.separator
                                        )}
                                    />
                                </div>
                            )}

                            <div className="grid gap-4">
                                {(social?.providers?.length ||
                                    genericOAuth?.providers?.length) && (
                                    <div
                                        className={cn(
                                            "flex w-full items-center justify-between gap-4",
                                            socialLayout === "horizontal" &&
                                                "flex-wrap",
                                            socialLayout === "vertical" &&
                                                "flex-col",
                                            socialLayout === "grid" &&
                                                "grid grid-cols-2"
                                        )}
                                    >
                                        {social?.providers?.map((provider) => {
                                            const socialProvider =
                                                socialProviders.find(
                                                    (socialProvider) =>
                                                        socialProvider.provider ===
                                                        provider
                                                )
                                            if (!socialProvider) return null

                                            return (
                                                <ProviderButton
                                                    key={provider}
                                                    classNames={classNames}
                                                    callbackURL={callbackURL}
                                                    isSubmitting={isSubmitting}
                                                    localization={localization}
                                                    provider={socialProvider}
                                                    redirectTo={redirectTo}
                                                    setIsSubmitting={
                                                        setIsSubmitting
                                                    }
                                                    socialLayout={socialLayout}
                                                />
                                            )
                                        })}

                                        {genericOAuth?.providers?.map(
                                            (provider) => (
                                                <ProviderButton
                                                    key={provider.provider}
                                                    classNames={classNames}
                                                    callbackURL={callbackURL}
                                                    isSubmitting={isSubmitting}
                                                    localization={localization}
                                                    provider={provider}
                                                    redirectTo={redirectTo}
                                                    setIsSubmitting={
                                                        setIsSubmitting
                                                    }
                                                    socialLayout={socialLayout}
                                                    other
                                                />
                                            )
                                        )}
                                    </div>
                                )}

                                {passkey &&
                                    [
                                        "SIGN_IN",
                                        "MAGIC_LINK",
                                        "EMAIL_OTP",
                                        "RECOVER_ACCOUNT",
                                        "TWO_FACTOR",
                                        "FORGOT_PASSWORD"
                                    ].includes(view) && (
                                        <PasskeyButton
                                            classNames={classNames}
                                            isSubmitting={isSubmitting}
                                            localization={localization}
                                            redirectTo={redirectTo}
                                            setIsSubmitting={setIsSubmitting}
                                        />
                                    )}
                            </div>
                        </>
                    )}
            </CardContent>

            {credentials && signUp && (
                <CardFooter
                    className={cn(
                        "justify-center gap-1.5 text-muted-foreground text-sm",
                        classNames?.footer
                    )}
                >
                    {view === "SIGN_IN" ||
                    view === "MAGIC_LINK" ||
                    view === "EMAIL_OTP" ? (
                        localization.DONT_HAVE_AN_ACCOUNT
                    ) : view === "SIGN_UP" ? (
                        localization.ALREADY_HAVE_AN_ACCOUNT
                    ) : (
                        <ArrowLeftIcon className="size-3" />
                    )}

                    {view === "SIGN_IN" ||
                    view === "MAGIC_LINK" ||
                    view === "EMAIL_OTP" ||
                    view === "SIGN_UP" ? (
                        <Link
                            className={cn(
                                "text-foreground underline",
                                classNames?.footerLink
                            )}
                            href={`${basePath}/${viewPaths[view === "SIGN_IN" || view === "MAGIC_LINK" || view === "EMAIL_OTP" ? "SIGN_UP" : "SIGN_IN"]}${isHydrated ? window.location.search : ""}`}
                        >
                            <Button
                                variant="link"
                                size="sm"
                                className={cn(
                                    "px-0 text-foreground underline",
                                    classNames?.footerLink
                                )}
                            >
                                {view === "SIGN_IN" ||
                                view === "MAGIC_LINK" ||
                                view === "EMAIL_OTP"
                                    ? localization.SIGN_UP
                                    : localization.SIGN_IN}
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            variant="link"
                            size="sm"
                            className={cn(
                                "px-0 text-foreground underline",
                                classNames?.footerLink
                            )}
                            onClick={() => window.history.back()}
                        >
                            {localization.GO_BACK}
                        </Button>
                    )}
                </CardFooter>
            )}
        </Card>
    )
}
