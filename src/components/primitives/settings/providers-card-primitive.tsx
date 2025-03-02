"use client"

import { Loader2 } from "lucide-react"
import { useContext, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { AuthUIContext } from "../../../lib/auth-ui-provider"
import { cn } from "../../../lib/utils"
import { type SocialProvider, socialProviders } from "../../../social-providers"
import type { SettingsCardClassNames } from "../../settings/settings-card"
import { settingsLocalization } from "../../settings/settings-cards"
import ProvidersCardSkeleton from "../../settings/skeletons/providers-card-skeleton"
import { Button } from "../../ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "../../ui/card"

type Error = {
    code?: string | undefined
    message?: string | undefined
    status?: number
    statusText?: string
}

export function ProvidersCardPrimitive({
    className,
    classNames,
    accounts,
    isPending,
    localization,
    optimistic,
    refetch,
    unlinkAccount
}: {
    className?: string
    classNames?: SettingsCardClassNames
    accounts?: { id: string, provider: string }[] | null
    isPending?: boolean
    localization?: Partial<typeof settingsLocalization>
    optimistic?: boolean
    refetch?: () => Promise<unknown>,
    unlinkAccount: (providerId: string) => Promise<{ status?: boolean, code?: string, error?: Error | null }>
}) {
    localization = { ...settingsLocalization, ...localization }

    const { authClient, colorIcons, noColorIcons, providers } = useContext(AuthUIContext)

    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const hasShownLinkedToast = useRef(false)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        if (params.get("providerLinked") && !hasShownLinkedToast.current) {
            hasShownLinkedToast.current = true
            setTimeout(() => {
                toast.success(localization.providerLinkSuccess)

                // Remove the parameter from URL
                params.delete("providerLinked")
                const query = params.toString()
                const url = `${window.location.pathname}${query ? "?" + query : ""}`
                window.history.replaceState(null, "", url)
            }, 0)
        }
    }, [localization.providerLinkSuccess])

    const handleLink = async (provider: SocialProvider) => {
        setActionLoading(provider)
        const callbackURL = `${window.location.pathname}?providerLinked=true`
        const { error } = await authClient.linkSocial({ provider, callbackURL })

        if (error) {
            toast.error(error.message || error.statusText)
            setActionLoading(null)
        }
    }

    const handleUnlink = async (providerId: string) => {
        if (!optimistic) setActionLoading(providerId)

        const { error } = await unlinkAccount(providerId)

        if (error) {
            toast.error(error.message || error.statusText)
        } else {
            await refetch?.()
            toast.success(localization.providerUnlinkSuccess)
        }

        setActionLoading(null)
    }

    if (isPending) {
        return <ProvidersCardSkeleton className={className} />
    }

    return (
        <Card className={cn("max-w-lg w-full", className, classNames?.base)}>
            <CardHeader className={classNames?.header}>
                <CardTitle className={cn("text-lg md:text-xl", classNames?.title)}>
                    {localization.providers}
                </CardTitle>

                <CardDescription className={cn("text-xs md:text-sm", classNames?.description)}>
                    {localization.providersDescription}
                </CardDescription>
            </CardHeader>

            <CardContent className={cn("flex flex-col gap-3", classNames?.content)}>
                {providers?.map((provider) => {
                    const socialProvider = socialProviders.find((socialProvider) => socialProvider.provider === provider)
                    if (!socialProvider) return null

                    const isLinked = accounts?.some(acc => acc.provider === socialProvider.provider)
                    const isButtonLoading = actionLoading === provider || actionLoading === provider

                    return (
                        <Card key={provider} className="flex items-center gap-3 px-4 py-3">
                            {colorIcons ? (
                                <socialProvider.icon className="size-4" color />
                            ) : noColorIcons ? (
                                <socialProvider.icon className="size-4" />
                            ) : (
                                <>
                                    <socialProvider.icon className="size-4 dark:hidden" color />
                                    <socialProvider.icon className="size-4 hidden dark:block" />
                                </>
                            )}

                            <span className="text-sm">
                                {socialProvider.name}
                            </span>

                            <Button
                                className={cn("ms-auto relative", classNames?.saveButton)}
                                disabled={isButtonLoading}
                                size="sm"
                                type="button"
                                variant={isLinked ? "secondary" : "default"}
                                onClick={() => {
                                    if (actionLoading) return

                                    if (isLinked) {
                                        handleUnlink(provider)
                                    } else {
                                        handleLink(provider)
                                    }
                                }}
                            >
                                <span className={isButtonLoading ? "opacity-0" : "opacity-100"}>
                                    {isLinked ? localization.providerUnlink : localization.providerLink}
                                </span>

                                {isButtonLoading && (
                                    <span className="absolute">
                                        <Loader2 className="animate-spin" />
                                    </span>
                                )}
                            </Button>
                        </Card>
                    )
                })}
            </CardContent>
        </Card>
    )
}