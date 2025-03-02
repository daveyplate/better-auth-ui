"use client"

import { useContext } from "react"

import { useListAccounts } from "../../hooks/use-list-accounts"
import { AuthUIContext } from "../../lib/auth-ui-provider"
import { ProvidersCardPrimitive } from "../primitives/settings/providers-card-primitive"

import type { SettingsCardClassNames } from "./settings-card"
import { settingsLocalization } from "./settings-cards"

export function ProvidersCard({
    className,
    classNames,
    localization
}: {
    className?: string
    classNames?: SettingsCardClassNames
    localization?: Partial<typeof settingsLocalization>
}) {
    const { authClient } = useContext(AuthUIContext)
    const { accounts, isPending, refetch } = useListAccounts()

    return (
        <ProvidersCardPrimitive
            accounts={accounts}
            className={className}
            classNames={classNames}
            isPending={isPending}
            localization={localization}
            refetch={refetch}
            unlinkAccount={(providerId: string) => authClient.unlinkAccount({ providerId })}
        />
    )
}