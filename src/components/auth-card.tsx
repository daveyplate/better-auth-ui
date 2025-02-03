"use client"

import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { NextRouter } from "next/router"
import { createAuthClient } from "better-auth/react"

import { cn } from "../lib/utils"

import { Alert as AlertDefault, AlertDescription as AlertDescriptionDefault, AlertTitle as AlertTitleDefault } from "../components/ui/alert"
import { Alert as AlertNewYork, AlertDescription as AlertDescriptionNewYork, AlertTitle as AlertTitleNewYork } from "../components/ui/new-york/alert"

import { Button as ButtonDefault } from "../components/ui/button"
import { Button as ButtonNewYork } from "../components/ui/new-york/button"

import {
    Card as CardDefault,
    CardContent as CardContentDefault,
    CardHeader as CardHeaderDefault,
    CardTitle as CardTitleDefault,
    CardDescription as CardDescriptionDefault,
    CardFooter as CardFooterDefault
} from "../components/ui/card"
import {
    Card as CardNewYork,
    CardContent as CardContentNewYork,
    CardHeader as CardHeaderNewYork,
    CardTitle as CardTitleNewYork,
    CardDescription as CardDescriptionNewYork,
    CardFooter as CardFooterNewYork
} from "../components/ui/new-york/card"

import { Input as InputDefault } from "../components/ui/input"
import { Input as InputNewYork } from "../components/ui/new-york/input"

import { Label as LabelDefault } from "../components/ui/label"
import { Label as LabelNewYork } from "../components/ui/new-york/label"

import { AlertCircle, Eye, EyeOff, Key, Loader2, LockIcon, MailIcon } from "lucide-react"

import { SocialProvider, socialProviders } from "../social-providers"
import { useIsHydrated } from "../hooks/use-is-hydrated"
import { AuthView, authViews } from "../auth-views"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

type AuthClient = ReturnType<typeof createAuthClient>

const DefaultLink = (
    { href, className, children }: { href: string, className?: string, children: ReactNode }
) => (
    <a href={href} className={className}>
        {children}
    </a>
)

const defaultNavigate = (href: string) => window.location.href = href

export const defaultLocalization = {
    login_title: "Login",
    signup_title: "Sign up",
    magic_link_title: "Magic link",
    forgot_password_title: "Forgot password",
    reset_password_title: "Reset password",
    login_description: "Enter your email to login to your account",
    signup_description: "Enter your information to create your account",
    magic_link_description: "Enter your email to receive a magic link",
    forgot_password_description: "Enter your email to reset your password",
    reset_password_description: "Enter your new password below",
    provider_description: "Choose a provider to continue",
    email_label: "Email",
    username_label: "Username",
    name_label: "Name",
    password_label: "Password",
    email_placeholder: "m@example.com",
    username_placeholder: "Username",
    name_placeholder: "Name",
    password_placeholder: "Password",
    login_button: "Login",
    signup_button: "Create account",
    magic_link_button: "Send magic link",
    forgot_password_button: "Send reset link",
    reset_password_button: "Save new password",
    provider_prefix: "Continue with",
    magic_link_provider: "Magic Link",
    passkey_provider: "Passkey",
    password_provider: "Password",
    login_footer: "Don't have an account?",
    signup_footer: "Already have an account?",
    forgot_password: "Forgot your password?",
    login: "Login",
    signup: "Sign up",
    verification_link_email: "Check your email for the verification link",
    reset_password_email: "Check your email for the password reset link",
    magic_link_email: "Check your email for the magic link",
    password_updated: "Password updated",
    loading: "Loading",
    error: "Error",
    alert: "Alert",
    or_continue_with: "Or continue with",
}

export type AuthToastOptions = {
    description: string
    variant: "default" | "destructive"
    action?: {
        label: string
        onClick: () => void
    }
}

export type AuthClassNames = {
    card?: string
    cardHeader?: string
    cardTitle?: string
    cardDescription?: string
    cardContent?: string
    cardFooter?: string
    form?: string
    input?: string
    label?: string
    button?: string
    secondaryButton?: string
    providerButton?: string
    link?: string
    alert?: string
    alertTitle?: string
    alertDescription?: string
    alertButton?: string
}

export interface AuthCardProps {
    authClient: AuthClient,
    navigate?: (url: string) => void
    pathname?: string
    nextRouter?: NextRouter
    appRouter?: AppRouterInstance
    initialView?: AuthView
    emailPassword?: boolean
    username?: boolean
    forgotPassword?: boolean
    magicLink?: boolean
    passkey?: boolean
    providers?: SocialProvider[]
    socialLayout?: "horizontal" | "vertical"
    localization?: Partial<typeof defaultLocalization>
    disableRouting?: boolean
    disableAnimation?: boolean
    signUpWithName?: boolean
    redirectTo?: string
    callbackURL?: string
    authPaths?: Partial<Record<AuthView, string>>
    classNames?: Partial<AuthClassNames>
    componentStyle?: "default" | "new-york"
    onSessionChange?: () => void,
    toast?: (options: AuthToastOptions) => void
    LinkComponent?: React.ComponentType<{ href: string, to: any, className?: string, children: ReactNode }>
}

const hideElementClass = "opacity-0 scale-y-0 h-0 overflow-hidden -my-2"
const transitionClass = "transition-all"

export function AuthCard({
    authClient,
    navigate,
    pathname,
    nextRouter,
    appRouter,
    initialView,
    emailPassword = true,
    forgotPassword = true,
    magicLink,
    passkey,
    providers,
    socialLayout,
    localization,
    disableRouting,
    disableAnimation,
    signUpWithName,
    redirectTo,
    callbackURL,
    authPaths,
    classNames,
    componentStyle = "default",
    onSessionChange,
    toast,
    LinkComponent = DefaultLink
}: AuthCardProps) {
    const Input = componentStyle == "new-york" ? InputNewYork : InputDefault
    const Label = componentStyle == "new-york" ? LabelNewYork : LabelDefault

    const Alert = componentStyle == "new-york" ? AlertNewYork : AlertDefault
    const AlertTitle = componentStyle == "new-york" ? AlertTitleNewYork : AlertTitleDefault
    const AlertDescription = componentStyle == "new-york" ? AlertDescriptionNewYork : AlertDescriptionDefault

    const Button = componentStyle == "new-york" ? ButtonNewYork : ButtonDefault

    const Card = componentStyle == "new-york" ? CardNewYork : CardDefault
    const CardContent = componentStyle == "new-york" ? CardContentNewYork : CardContentDefault
    const CardHeader = componentStyle == "new-york" ? CardHeaderNewYork : CardHeaderDefault
    const CardTitle = componentStyle == "new-york" ? CardTitleNewYork : CardTitleDefault
    const CardDescription = componentStyle == "new-york" ? CardDescriptionNewYork : CardDescriptionDefault
    const CardFooter = componentStyle == "new-york" ? CardFooterNewYork : CardFooterDefault

    const isHydrated = useIsHydrated()
    const signingOut = useRef(false)

    localization = { ...defaultLocalization, ...localization }
    navigate = useMemo(() => navigate || nextRouter?.push || appRouter?.push || defaultNavigate, [navigate, nextRouter, appRouter])
    pathname = useMemo(() => nextRouter?.isReady ? nextRouter.asPath : pathname, [pathname, nextRouter?.asPath, nextRouter?.isReady])
    socialLayout = useMemo(() => socialLayout || ((providers && providers.length > 2 && (emailPassword || magicLink)) ? "horizontal" : "vertical"), [socialLayout, providers, emailPassword, magicLink])

    const getAuthPath = useCallback((view: AuthView) => {
        return authPaths?.[view] || view
    }, [authPaths])

    const currentPathView = useMemo(() => {
        const currentPathname = pathname || (isHydrated ? window.location.pathname : null)

        const path = currentPathname?.split("/").pop()?.split("?")[0]

        const authPath = Object.keys(authPaths || {}).find((key) => authPaths?.[key as AuthView] == path)
        if (authPath) return authPath as AuthView

        if (authViews.includes(path as AuthView)) return path as AuthView
    }, [pathname, authPaths, isHydrated])

    redirectTo = useMemo(() => {
        if (redirectTo) return redirectTo

        if (nextRouter?.query?.redirectTo) {
            return nextRouter.query.redirectTo as string
        }

        if (isHydrated) {
            const queryString = window.location.search
            const urlParams = new URLSearchParams(queryString)
            const redirectToParam = urlParams.get("redirectTo")
            if (redirectToParam) return redirectToParam
        }

        return "/"
    }, [redirectTo, nextRouter?.query?.redirectTo, isHydrated])

    const getPathname = useCallback((view: AuthView) => {
        const authPath = getAuthPath(view)
        const currentPathname = pathname || (isHydrated ? window.location.pathname : null)
        const path = currentPathname?.split("/").slice(0, -1).join("/")
        return `${path}/${authPath}` + ((redirectTo != "/" && isHydrated && new URLSearchParams(window.location.search).get("redirectTo")) ? `?redirectTo=${encodeURIComponent(redirectTo!)}` : "")
    }, [redirectTo, isHydrated, pathname, getAuthPath])

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [view, setView] = useState(disableRouting ? initialView : currentPathView)
    const [authToast, setAuthToast] = useState<AuthToastOptions | null>(null)
    const [showPassword, setShowPassword] = useState(false)

    const onSubmit = async (e: FormEvent) => {
        e?.preventDefault()

        setAuthToast(null)
        setLoading(true)

        let apiError: {
            code?: string
            message?: string
            status: number
            statusText: string
        } | null = null

        switch (view) {
            case "login": {
                const { error } = await authClient.signIn.email({ email, password })
                apiError = error

                if (!error) {
                    navigate(redirectTo)
                    onSessionChange?.()
                }

                break
            }
            case "signup": {
                const { data, error } = await authClient.signUp.email({ email, password, name, callbackURL })

                if (!error) {
                    if (!data?.token) {
                        setEmail("")
                        setPassword("")
                        setView("login")
                        setAuthToast({
                            description: localization.verification_link_email!,
                            variant: "default"
                        })
                    } else {
                        navigate(redirectTo)
                        onSessionChange?.()
                    }
                }

                apiError = error

                break
            }
            case "magic-link": {
                const { error } = await (authClient.signIn as any).magicLink({
                    email,
                    callbackURL
                })
                apiError = error

                if (!error) {
                    setEmail("")
                    setAuthToast({
                        description: localization.magic_link_email!,
                        variant: "default"
                    })
                }

                break
            }
            case "forgot-password": {
                const { error } = await authClient.forgetPassword({
                    email: email,
                    redirectTo: getPathname("reset-password")
                })
                apiError = error

                if (!error) {
                    setView("login")

                    setAuthToast({
                        description: localization.reset_password_email!,
                        variant: "default"
                    })
                }

                break
            }
            case "reset-password": {
                const queryString = window.location.search
                const urlParams = new URLSearchParams(queryString)
                const token = urlParams.get("token")!
                const { error } = await authClient.resetPassword({
                    newPassword: password,
                    token
                })
                apiError = error

                setPassword("")

                if (!error) {
                    setView("login")

                    setAuthToast({
                        description: localization.password_updated!,
                        variant: "default"
                    })
                }

                break
            }
        }

        setLoading(false)

        if (apiError) {
            setAuthToast({
                description: apiError.message || apiError.statusText,
                variant: "destructive"
            })
        }
    }

    useEffect(() => {
        if (!authToast || !toast) return
        toast(authToast)
    }, [toast, authToast])

    useEffect(() => {
        if (!currentPathView || disableRouting) return
        if (currentPathView != view) setView(currentPathView)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPathView, disableRouting])

    useEffect(() => {
        setAuthToast(null)
        setShowPassword(false)
        if (disableRouting || !view) return
        if (currentPathView != view) navigate(getPathname(view))

        if (view == "reset-password") {
            const queryString = window.location.search
            const urlParams = new URLSearchParams(queryString)
            const token = urlParams.get("token")

            if (token == "INVALID_TOKEN") {
                setAuthToast({
                    description: "Invalid token",
                    variant: "destructive"
                })

                setView("forgot-password")
            }

            if (!token) setView("forgot-password")
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disableRouting, view])

    useEffect(() => {
        if (!magicLink && view == "magic-link") setView("login")
        if (magicLink && !emailPassword && view == "login") setView("magic-link")
        if (["signup", "forgot-password", "reset-password"].includes(view!) && !emailPassword) setView(magicLink ? "magic-link" : "login")
    }, [magicLink, emailPassword, view])

    useEffect(() => {
        if (view != "logout") return
        if (signingOut.current) return

        signingOut.current = true
        authClient.signOut().finally(async () => {
            navigate(redirectTo)
            onSessionChange?.()
        })
    }, [authClient, view, redirectTo, onSessionChange, navigate])

    if (view == "logout") {
        return <Loader2 className="animate-spin" />
    }

    return (
        <Card
            className={cn(!view && "opacity-0",
                !disableAnimation && transitionClass,
                "max-w-sm w-full",
                classNames?.card
            )}
        >
            <CardHeader
                className={classNames?.cardHeader}
            >
                <CardTitle
                    className={cn(
                        "text-xl",
                        classNames?.cardTitle
                    )}
                >
                    {view && localization[`${view.replace("-", "_")}_title` as keyof typeof localization]}
                </CardTitle>

                <CardDescription
                    className={classNames?.cardDescription}
                >
                    {(emailPassword || magicLink) ? (view && localization[`${view.replace("-", "_")}_description` as keyof typeof localization])
                        : localization.provider_description}
                </CardDescription>
            </CardHeader>

            <CardContent
                className={classNames?.cardContent}
            >
                <form
                    className={cn(
                        "flex flex-col gap-4",
                        classNames?.form
                    )}
                    onSubmit={onSubmit}
                >
                    {signUpWithName && (
                        <div
                            className={cn(view != "signup" ? hideElementClass : "h-[62px]",
                                "grid gap-2"
                            )}
                        >
                            <Label
                                className={classNames?.label}
                                htmlFor="name"
                            >
                                {localization.name_label}
                            </Label>

                            <Input
                                id="name"
                                className={classNames?.input}
                                required
                                placeholder={localization.name_placeholder}
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                disabled={view != "signup"}
                            />
                        </div>
                    )}

                    {(emailPassword || magicLink) && (
                        <div
                            className={cn(
                                view == "reset-password" ? hideElementClass : "h-[62px]",
                                !disableAnimation && transitionClass,
                                "grid gap-2"
                            )}
                        >
                            <Label
                                className={classNames?.label}
                                htmlFor="email"
                            >
                                {localization.email_label}
                            </Label>

                            <Input
                                id="email"
                                className={classNames?.input}
                                type="email"
                                placeholder={localization.email_placeholder}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                disabled={view == "reset-password"}
                            />
                        </div>
                    )}

                    {emailPassword && (
                        <div
                            className={cn(
                                (view == "magic-link" || view == "forgot-password") ? hideElementClass : "h-[62px]",
                                !disableAnimation && transitionClass,
                                "grid gap-2"
                            )}
                        >
                            <div className="flex items-center relative">
                                <Label
                                    className={classNames?.label}
                                    htmlFor="password"
                                >
                                    {localization.password_label}
                                </Label>

                                {forgotPassword && (
                                    <div
                                        className={cn(
                                            view != "login" && "opacity-0",
                                            !disableAnimation && transitionClass,
                                            "absolute right-0"
                                        )}
                                    >
                                        <Button
                                            asChild={!disableRouting || view != "login"}
                                            type="button"
                                            variant="link"
                                            size="sm"
                                            className={cn(
                                                "text-sm px-1 h-fit text-foreground hover-underline",
                                                classNames?.link
                                            )}
                                            onClick={() => disableRouting && setView("forgot-password")}
                                            disabled={view != "login"}
                                            tabIndex={view != "login" ? -1 : undefined}
                                        >
                                            {(disableRouting || view != "login") ? (
                                                localization.forgot_password
                                            ) : (
                                                <LinkComponent
                                                    href={getPathname("forgot-password")}
                                                    to={getPathname("forgot-password")}
                                                >
                                                    {localization.forgot_password}
                                                </LinkComponent>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <Input
                                    id="password"
                                    required
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    autoComplete={["magic-link", "forgot-password"].includes(view!) ? "off" : (["signup", "reset-password"].includes(view!) ? "new-password" : "password")}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={["magic-link", "forgot-password"].includes(view!)}
                                    className={cn(
                                        "pr-10",
                                        classNames?.input
                                    )}
                                />

                                <Button
                                    type="button"
                                    className={cn(["login"].includes(view!) && "!opacity-0",
                                        !disableAnimation && transitionClass,
                                        "bg-transparent hover:bg-transparent text-foreground absolute right-0 top-0 h-full px-3 self-center"
                                    )}
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={!password || ["login"].includes(view!)}
                                >
                                    {showPassword ? (
                                        <EyeOff />
                                    ) : (
                                        <Eye />
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {!toast && (
                        <div
                            className={cn(!authToast && hideElementClass,
                                !disableAnimation && transitionClass,
                            )}
                        >
                            <Alert
                                variant={authToast?.variant}
                                className={cn(
                                    authToast?.variant == "destructive" ? "bg-destructive/10" : "bg-foreground/5",
                                    classNames?.alert
                                )}
                            >
                                {authToast?.action && (
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        className={cn(
                                            "absolute top-5 right-4 text-foreground",
                                            classNames?.alertButton
                                        )}
                                        onClick={authToast?.action.onClick}
                                    >
                                        {authToast?.action.label}
                                    </Button>
                                )}

                                <AlertCircle className="h-4 w-4" />

                                <AlertTitle
                                    className={classNames?.alertTitle}
                                >
                                    {authToast?.variant == "destructive" ? localization.error : localization.alert}
                                </AlertTitle>

                                <AlertDescription
                                    className={classNames?.alertDescription}
                                >
                                    {authToast?.description}
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}

                    {(emailPassword || magicLink) && (
                        <Button
                            type="submit"
                            className={cn(
                                "w-full",
                                classNames?.button
                            )}
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                view && localization[`${view.replace("-", "_")}_button` as keyof typeof localization]
                            )}
                        </Button>
                    )}

                    {magicLink && emailPassword && (
                        <div
                            className={cn((!["signup", "login", "magic-link"].includes(view!)) ? hideElementClass : "h-10",
                                !disableAnimation && transitionClass,
                            )}
                        >
                            <Button
                                type="button"
                                variant="secondary"
                                className={cn(
                                    "gap-2 w-full",
                                    classNames?.secondaryButton
                                )}
                                onClick={() => setView(view == "magic-link" ? "login" : "magic-link")}
                                disabled={!["signup", "login", "magic-link"].includes(view!)}
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    view == "magic-link" ? <LockIcon /> : <MailIcon />
                                )}
                                
                                {localization.provider_prefix}
                                {" "}
                                {view == "magic-link" ? localization.password_provider : localization.magic_link_provider}
                            </Button>
                        </div>
                    )}

                    {passkey && (
                        <div
                            className={cn(!["login", "magic-link"].includes(view!) ? hideElementClass : "h-10",
                                !disableAnimation && transitionClass,
                            )}
                        >
                            <Button
                                type="button"
                                variant="secondary"
                                className={cn(
                                    "gap-2 w-full",
                                    classNames?.secondaryButton
                                )}
                                onClick={async () => {
                                    const { error } = await (authClient.signIn as any).passkey({
                                        callbackURL
                                    })

                                    if (error) {
                                        setAuthToast({
                                            description: error.message || error.statusText,
                                            variant: "destructive"
                                        })
                                    }
                                }}
                                disabled={!["login", "magic-link"].includes(view!)}
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <Key />
                                )}

                                {localization.provider_prefix}
                                {" "}
                                {localization.passkey_provider}
                            </Button>
                        </div>
                    )}

                    <div
                        className={cn((!providers?.length || !["login", "signup", "magic-link"].includes(view!)) && hideElementClass,
                            !disableAnimation && transitionClass,
                            "flex flex-col gap-4"
                        )}
                    >
                        <div
                            className={cn(
                                "w-full gap-2 flex items-center",
                                "justify-between flex-wrap transition-all",
                            )}
                        >
                            {providers?.map((provider) => {
                                const socialProvider = socialProviders.find((p) => p.provider == provider)
                                if (!socialProvider) return null
                                return (
                                    <Button
                                        key={provider}
                                        type="button"
                                        variant="outline"
                                        className={cn(
                                            "grow",
                                            classNames?.providerButton
                                        )}
                                        disabled={loading || !["login", "signup", "magic-link"].includes(view!)}
                                        onClick={async () => {
                                            const { error } = await authClient.signIn.social({
                                                provider,
                                                callbackURL
                                            })

                                            if (error) {
                                                setAuthToast({
                                                    description: error.message || error.statusText,
                                                    variant: "destructive"
                                                })
                                            }
                                        }}
                                    >
                                        {loading ? (
                                            <Loader2 className="animate-spin" />
                                        ) : (
                                            socialProvider.icon
                                        )}

                                        {socialLayout == "vertical" && (
                                            <>
                                                {localization.provider_prefix}
                                                {" "}
                                                {loading ? localization.loading : socialProvider.name}
                                            </>
                                        )}
                                    </Button>
                                )
                            })}
                        </div>
                    </div>
                </form>
            </CardContent>

            {emailPassword && (
                <CardFooter
                    className={cn(
                        classNames?.cardFooter
                    )}
                >
                    <div className="flex justify-center w-full border-t pt-4">
                        <p className="text-center text-sm text-muted-foreground">
                            {["signup", "forgot-password"].includes(view!) ? (
                                localization.signup_footer
                            ) : (
                                localization.login_footer
                            )}

                            <Button
                                asChild={!disableRouting}
                                type="button"
                                variant="link"
                                size="sm"
                                className={cn(
                                    "text-sm px-1 h-fit underline text-foreground",
                                    classNames?.link
                                )}
                                onClick={() => disableRouting && setView(["signup", "forgot-password"].includes(view!) ? "login" : "signup")}
                            >
                                {disableRouting ? (
                                    ["signup", "forgot-password"].includes(view!) ? localization.login : localization.signup
                                ) : (
                                    <LinkComponent
                                        href={["signup", "forgot-password"].includes(view!) ?
                                            getPathname("login")
                                            : getPathname("signup")
                                        }
                                        to={["signup", "forgot-password"].includes(view!) ?
                                            getPathname("login")
                                            : getPathname("signup")
                                        }
                                    >
                                        {["signup", "forgot-password"].includes(view!) ? localization.login : localization.signup}
                                    </LinkComponent>
                                )}
                            </Button>
                        </p>
                    </div>
                </CardFooter>
            )}
        </Card>
    )
}