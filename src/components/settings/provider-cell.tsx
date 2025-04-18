"use client"

import type { SocialProvider } from "better-auth/social-providers"
import { Loader2 } from "lucide-react"
import { useContext, useState } from "react"

import type { AuthLocalization } from "../../lib/auth-localization"
import { AuthUIContext } from "../../lib/auth-ui-provider"
import type { Provider } from "../../lib/social-providers"
import { cn, getLocalizedError } from "../../lib/utils"
import type { AuthClient } from "../../types/auth-client"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import type { SettingsCardClassNames } from "./shared/settings-card"

export interface ProviderCellProps {
    className?: string
    classNames?: SettingsCardClassNames
    accounts?: { accountId: string; provider: string }[] | null
    isPending?: boolean
    localization?: Partial<AuthLocalization>
    other?: boolean
    provider: Provider
    refetch?: () => Promise<void>
}

export function ProviderCell({
    className,
    classNames,
    accounts,
    localization,
    other,
    provider,
    refetch
}: ProviderCellProps) {
    const {
        authClient,
        basePath,
        colorIcons,
        mutators: { unlinkAccount },
        localization: contextLocalization,
        noColorIcons,
        toast,
        viewPaths
    } = useContext(AuthUIContext)

    const account = accounts?.find((acc) => acc.provider === provider.provider)
    const isLinked = !!account

    localization = { ...contextLocalization, ...localization }

    const [isLoading, setIsLoading] = useState(false)

    const handleLink = async () => {
        setIsLoading(true)
        const callbackURL = `${basePath}/${viewPaths.callback}?redirectTo=${window.location.pathname}`

        try {
            if (other) {
                await (authClient as AuthClient).oauth2.link({
                    providerId: provider.provider as SocialProvider,
                    callbackURL,
                    fetchOptions: { throw: true }
                })
            } else {
                await authClient.linkSocial({
                    provider: provider.provider as SocialProvider,
                    callbackURL,
                    fetchOptions: { throw: true }
                })
            }
        } catch (error) {
            toast({
                variant: "error",
                message: getLocalizedError({ error, localization })
            })

            setIsLoading(false)
        }
    }

    const handleUnlink = async () => {
        setIsLoading(true)

        try {
            await unlinkAccount({
                accountId: account?.accountId,
                providerId: provider.provider
            })

            await refetch?.()
        } catch (error) {
            toast({
                variant: "error",
                message: getLocalizedError({ error, localization })
            })
        }

        setIsLoading(false)
    }

    return (
        <Card className={cn("flex-row items-center gap-3 px-4 py-3", className, classNames?.cell)}>
            {provider.icon &&
                (colorIcons ? (
                    <provider.icon className="size-4" variant="color" />
                ) : noColorIcons ? (
                    <provider.icon className="size-4" />
                ) : (
                    <>
                        <provider.icon className="size-4 dark:hidden" variant="color" />
                        <provider.icon className="hidden size-4 dark:block" />
                    </>
                ))}

            <span className="text-sm">{provider.name}</span>

            <Button
                className={cn("relative ms-auto", classNames?.button)}
                disabled={isLoading}
                size="sm"
                type="button"
                variant={isLinked ? "outline" : "default"}
                onClick={isLinked ? handleUnlink : handleLink}
            >
                {isLoading && <Loader2 className="animate-spin" />}
                {isLinked ? localization.unlink : localization.link}
            </Button>
        </Card>
    )
}
