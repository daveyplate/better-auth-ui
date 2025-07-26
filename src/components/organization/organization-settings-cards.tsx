"use client"

import { useContext, useEffect } from "react"

import { AuthUIContext } from "../../lib/auth-ui-provider"
import { cn } from "../../lib/utils"
import type { SettingsCardsProps } from "../settings/settings-cards"
import { DeleteOrganizationCard } from "./delete-organization-card"
import { OrganizationLogoCard } from "./organization-logo-card"
import { OrganizationNameCard } from "./organization-name-card"
import { OrganizationSlugCard } from "./organization-slug-card"

export type OrganizationSettingsCardsProps = Omit<SettingsCardsProps, "view">

export function OrganizationSettingsCards({
    className,
    classNames,
    localization
}: OrganizationSettingsCardsProps) {
    const {
        basePath,
        hooks: { useActiveOrganization },
        organization,
        settings,
        replace,
        viewPaths
    } = useContext(AuthUIContext)

    const {
        data: activeOrganization,
        isPending: organizationPending,
        isRefetching: organizationFetching
    } = useActiveOrganization()

    useEffect(() => {
        if (organizationPending || organizationFetching) return
        if (!activeOrganization)
            replace(`${settings?.basePath || basePath}/${viewPaths.SETTINGS}`)
    }, [
        activeOrganization,
        organizationPending,
        organizationFetching,
        basePath,
        settings?.basePath,
        replace,
        viewPaths.SETTINGS
    ])

    return (
        <div
            className={cn(
                "flex w-full flex-col gap-4 md:gap-6",
                className,
                classNames?.cards
            )}
        >
            {organization?.logo && (
                <OrganizationLogoCard
                    classNames={classNames?.card}
                    localization={localization}
                />
            )}

            <OrganizationNameCard
                classNames={classNames?.card}
                localization={localization}
            />

            <OrganizationSlugCard
                classNames={classNames?.card}
                localization={localization}
            />

            <DeleteOrganizationCard
                classNames={classNames?.card}
                localization={localization}
            />
        </div>
    )
}
