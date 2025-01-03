import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import { NextRouter } from "next/router"
import { createAuthClient } from "better-auth/react"

import { cn } from "../lib/utils"

import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { Button } from "../components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"

import { Icon } from "@iconify/react"
import { AlertCircle, Eye, EyeOff, Key, Loader2, LockIcon, MailIcon } from "lucide-react"

import { SocialProvider, socialProviders } from "../social-providers"
import { useIsHydrated } from "../hooks/use-is-hydrated"

type AuthClient = ReturnType<typeof createAuthClient>

export const authViews = ["login", "signup", "logout", "magic-link", "forgot-password", "reset-password", "logout"] as const
export type AuthView = typeof authViews[number]

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

export interface AuthCardProps {
    authClient: AuthClient,
    navigate?: (url: string) => void
    pathname?: string
    nextRouter?: NextRouter
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
    callbackURL?: string
    toast?: (options: AuthToastOptions) => void
    LinkComponent?: React.ComponentType<{ href: string, className?: string, children: ReactNode }>
}

const hideElementClass = "opacity-0 scale-y-0 h-0 overflow-hidden -my-2"
const transitionClass = "transition-all"

export function AuthCard({
    authClient,
    navigate,
    pathname,
    nextRouter,
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
    callbackURL,
    toast,
    LinkComponent = DefaultLink
}: AuthCardProps) {
    const isHydrated = useIsHydrated()
    localization = { ...defaultLocalization, ...localization }
    navigate = useMemo(() => navigate || nextRouter?.push || defaultNavigate, [navigate, nextRouter])
    pathname = useMemo(() => pathname || nextRouter?.asPath, [pathname, nextRouter?.asPath])
    socialLayout = useMemo(() => socialLayout || ((providers && providers.length > 2 && (emailPassword || magicLink)) ? "horizontal" : "vertical"), [socialLayout, providers, emailPassword, magicLink])

    const currentPath = useMemo(() => {
        const currentPathname = isHydrated ? window.location.pathname : pathname
        const path = currentPathname?.split("/").pop()?.split("?")[0]
        if (authViews.includes(path as AuthView)) {
            return path as AuthView
        }

        return null
    }, [isHydrated, pathname])

    callbackURL = useMemo(() => {
        if (callbackURL) return callbackURL

        if (nextRouter?.query?.callbackURL) {
            return nextRouter.query.callbackURL as string
        }

        if (isHydrated) {
            const queryString = window.location.search
            const urlParams = new URLSearchParams(queryString)
            const callbackURLParam = urlParams.get("callbackURL")
            if (callbackURLParam) return callbackURLParam
        }

        return "/"
    }, [callbackURL, nextRouter?.query?.callbackURL, isHydrated])

    const getPathname = useCallback((view: AuthView) => {
        const currentPathname = isHydrated ? window.location.pathname : pathname
        const path = currentPathname?.split("/").slice(0, -1).join("/")
        return `${path}/${view}` + (callbackURL != "/" ? `?callbackURL=${encodeURIComponent(callbackURL!)}` : "")
    }, [callbackURL, isHydrated, pathname])

    const { data: sessionData, isPending: sessionPending } = authClient.useSession()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [view, setView] = useState(disableRouting ? initialView : currentPath)
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

                break
            }
            case "signup": {
                const { error } = await authClient.signUp.email({ email, password, name, callbackURL })
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
        if (!currentPath || disableRouting) return
        if (currentPath != view) setView(currentPath)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPath, disableRouting])

    useEffect(() => {
        setAuthToast(null)
        if (disableRouting || !view) return
        if (currentPath != view) navigate(getPathname(view))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disableRouting, view])

    useEffect(() => {
        if (!magicLink && view == "magic-link") setView("login")
        if (magicLink && !emailPassword && view == "login") setView("magic-link")
        if (["signup", "forgot-password", "reset-password"].includes(view!) && !emailPassword) setView(magicLink ? "magic-link" : "login")
    }, [magicLink, emailPassword, view])

    useEffect(() => {
        if (view != "logout") return

        if (sessionData && !(sessionData.user as Record<string, unknown>).isAnonymous) {
            authClient.signOut()
        } else if (!sessionPending) {
            setView("login")
        }
    }, [authClient, sessionData, sessionPending, view])

    useEffect(() => {
        if (["reset-password", "logout"].includes(view!)) return

        if (sessionData && !(sessionData.user as Record<string, unknown>).isAnonymous) {
            navigate(callbackURL)
        }
    }, [callbackURL, navigate, sessionData, view])

    if (view == "logout") {
        return <Loader2 className="animate-spin" />
    }

    return (
        <Card
            className={cn(!view && "opacity-0",
                !disableAnimation && transitionClass,
                "max-w-sm w-full"
            )}
        >
            <CardHeader>
                <CardTitle className="text-xl">
                    {view && localization[`${view.replace("-", "_")}_title` as keyof typeof localization]}
                </CardTitle>

                <CardDescription>
                    {(emailPassword || magicLink) ? (view && localization[`${view.replace("-", "_")}_description` as keyof typeof localization])
                        : localization.provider_description}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                    {signUpWithName && (
                        <div
                            className={cn(view != "signup" ? hideElementClass : "h-[62px]",
                                "grid gap-2"
                            )}
                        >
                            <Label htmlFor="name">
                                {localization.name_label}
                            </Label>

                            <Input
                                id="name"
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
                            <Label htmlFor="email">
                                {localization.email_label}
                            </Label>

                            <Input
                                id="email"
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
                                <Label htmlFor="password">
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
                                            className="text-sm px-1 h-fit text-foreground hover-underline"
                                            onClick={() => disableRouting && setView("forgot-password")}
                                            disabled={view != "login"}
                                            tabIndex={view != "login" ? -1 : undefined}
                                        >
                                            {(disableRouting || view != "login") ? (
                                                localization.forgot_password
                                            ) : (
                                                <LinkComponent href={getPathname("forgot-password")}>
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
                                    className="pr-10"
                                />

                                <Button
                                    type="button"
                                    className={cn(["login"].includes(view!) && "!opacity-0",
                                        !disableAnimation && transitionClass,
                                        "bg-transparent hover:bg-transparent text-foreground absolute right-0 top-0 h-full px-3 self-center"
                                    )}
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={!password}
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
                                className={authToast?.variant == "destructive" ? "bg-destructive/10" : "bg-foreground/5"}
                            >
                                {authToast?.action && (
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        className="absolute top-5 right-4 text-foreground"
                                        onClick={authToast?.action.onClick}
                                    >
                                        {authToast?.action.label}
                                    </Button>
                                )}

                                <AlertCircle className="h-4 w-4" />

                                <AlertTitle>
                                    {authToast?.variant == "destructive" ? localization.error : localization.alert}
                                </AlertTitle>

                                <AlertDescription>
                                    {authToast?.description}
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}

                    {(emailPassword || magicLink) && (
                        <Button
                            type="submit"
                            className="w-full"
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
                                className="gap-2 w-full"
                                onClick={() => setView(view == "magic-link" ? "login" : "magic-link")}
                                disabled={!["signup", "login", "magic-link"].includes(view!)}
                            >
                                {view == "magic-link" ? <LockIcon /> : <MailIcon />}
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
                                className="gap-2 w-full"
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
                                <Key />
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
                                        className="grow"
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
                                        <Icon icon={socialProvider.icon} />

                                        {socialLayout == "vertical" && (
                                            <>
                                                {localization.provider_prefix}
                                                {" "}
                                                {socialProvider.name}
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
                <CardFooter>
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
                                className="text-sm px-1 h-fit underline text-foreground"
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