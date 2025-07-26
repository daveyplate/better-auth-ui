"use client"

import { MenuIcon } from "lucide-react"
import { useContext, useEffect } from "react"

import type { Organization } from "better-auth/plugins/organization"
import { useAuthenticate } from "../../hooks/use-authenticate"
import { AuthUIContext } from "../../lib/auth-ui-provider"
import { cn, getAuthViewByPath } from "../../lib/utils"
import type { AuthLocalization } from "../../localization/auth-localization"
import { OrganizationInvitationsCard } from "../organization/organization-invitations-card"
import { OrganizationMembersCard } from "../organization/organization-members-card"
import { OrganizationSettingsCards } from "../organization/organization-settings-cards"
import { OrganizationsCard } from "../organization/organizations-card"
import { Button } from "../ui/button"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "../ui/drawer"
import { Label } from "../ui/label"
import { AccountSettingsCards } from "./account-settings-cards"
import { APIKeysCard } from "./api-key/api-keys-card"
import { SecuritySettingsCards } from "./security-settings-cards"
import type { SettingsCardClassNames } from "./shared/settings-card"

export type SettingsCardsClassNames = {
    base?: string
    card?: SettingsCardClassNames
    cards?: string
    icon?: string
    drawer?: {
        base?: string
        trigger?: string
        content?: string
        menuIcon?: string
        menuItem?: string
    }
    sidebar?: {
        base?: string
        button?: string
        buttonActive?: string
    }
}

export const settingsViews = [
    "SETTINGS",
    "SECURITY",
    "API_KEYS",
    "ORGANIZATION",
    "ORGANIZATION_API_KEYS",
    "ORGANIZATIONS",
    "MEMBERS"
] as const
export type SettingsView = (typeof settingsViews)[number]

interface NavigationItem {
    view: SettingsView
    label?: string
}

export interface SettingsCardsProps {
    className?: string
    classNames?: SettingsCardsClassNames
    localization?: AuthLocalization
    pathname?: string
    view?: SettingsView
}

export function SettingsCards({
    className,
    classNames,
    localization,
    pathname,
    view
}: SettingsCardsProps) {
    useAuthenticate()

    const {
        apiKey,
        basePath,
        hooks: { useActiveOrganization },
        localization: contextLocalization,
        organization,
        settings,
        viewPaths,
        replace,
        Link
    } = useContext(AuthUIContext)

    localization = { ...contextLocalization, ...localization }

    let activeOrganization: Organization | null | undefined = null
    let organizationPending = false

    if (organization) {
        const { data, isPending } = useActiveOrganization()
        activeOrganization = data
        organizationPending = isPending || false
    }

    // Determine view from pathname if provided
    const path = pathname?.split("/").pop()
    view =
        view ||
        (getAuthViewByPath(viewPaths, path) as SettingsView) ||
        "SETTINGS"

    useEffect(() => {
        if (organizationPending) return

        const organizationOnlyViews = [
            "ORGANIZATION",
            "ORGANIZATION_API_KEYS",
            "MEMBERS"
        ]
        if (
            organizationOnlyViews.includes(view) &&
            (!organization || !activeOrganization)
        ) {
            replace(`${settings?.basePath || basePath}/${viewPaths.SETTINGS}`)
        }
    }, [
        activeOrganization,
        organizationPending,
        view,
        basePath,
        organization,
        settings?.basePath,
        replace,
        viewPaths
    ])

    // Personal settings group
    const personalGroup: NavigationItem[] = [
        {
            view: "SETTINGS",
            label: localization.ACCOUNT
        },
        {
            view: "SECURITY",
            label: localization.SECURITY
        }
    ]

    if (apiKey) {
        personalGroup.push({
            view: "API_KEYS",
            label: localization.API_KEYS
        })
    }

    if (organization) {
        personalGroup.push({
            view: "ORGANIZATIONS",
            label: localization.ORGANIZATIONS
        })
    }

    // Organization settings group
    const organizationGroup: NavigationItem[] = []

    if (organization) {
        organizationGroup.push({
            view: "ORGANIZATION",
            label: localization.ORGANIZATION
        })

        organizationGroup.push({
            view: "MEMBERS",
            label: localization.MEMBERS
        })

        // Add API Keys to organization navigation if enabled
        if (organization.apiKey) {
            organizationGroup.push({
                view: "ORGANIZATION_API_KEYS",
                label: localization.API_KEYS
            })
        }
    }

    // Determine which group the current view belongs to
    const isPersonalView = personalGroup.some((item) => item.view === view)
    const isOrganizationView =
        organizationGroup.some((item) => item.view === view) ||
        view === "MEMBERS"

    // Show navigation for the current group
    const currentNavigationGroup = isOrganizationView
        ? organizationGroup
        : personalGroup

    // Flatten all items for finding current item
    const currentItem = currentNavigationGroup.find(
        (item) => item.view === view
    )

    return (
        <div
            className={cn(
                "flex w-full grow flex-col gap-4 md:flex-row md:gap-12",
                className,
                classNames?.base
            )}
        >
            <div className="flex justify-between gap-2 md:hidden">
                <Label className="font-semibold text-base">
                    {currentItem?.label}
                </Label>

                <Drawer>
                    <DrawerTrigger asChild>
                        <Button
                            className={cn(classNames?.drawer?.trigger)}
                            variant="outline"
                        >
                            <MenuIcon
                                className={cn(classNames?.drawer?.menuIcon)}
                            />
                        </Button>
                    </DrawerTrigger>

                    <DrawerContent className={cn(classNames?.drawer?.content)}>
                        <DrawerHeader>
                            <DrawerTitle className="hidden">
                                {localization.SETTINGS}
                            </DrawerTitle>
                        </DrawerHeader>
                        <div className="flex flex-col px-4 pb-4">
                            {currentNavigationGroup.map((item) => (
                                <Link
                                    key={item.view}
                                    href={`${settings?.basePath || basePath}/${viewPaths[item.view]}`}
                                >
                                    <Button
                                        size="lg"
                                        className={cn(
                                            "w-full justify-start px-4 transition-none",
                                            classNames?.drawer?.menuItem,
                                            view === item.view
                                                ? "font-semibold"
                                                : "text-foreground/70"
                                        )}
                                        variant="ghost"
                                    >
                                        {item.label}
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>

            <div className="hidden md:block">
                <div
                    className={cn(
                        "flex w-60 flex-col gap-1",
                        classNames?.sidebar?.base
                    )}
                >
                    {currentNavigationGroup.map((item) => (
                        <Link
                            key={item.view}
                            href={`${settings?.basePath || basePath}/${viewPaths[item.view]}`}
                        >
                            <Button
                                size="lg"
                                className={cn(
                                    "w-full justify-start px-4 transition-none",
                                    classNames?.sidebar?.button,
                                    view === item.view
                                        ? "font-semibold"
                                        : "text-foreground/70",
                                    view === item.view &&
                                        classNames?.sidebar?.buttonActive
                                )}
                                variant="ghost"
                            >
                                {item.label}
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>

            {view === "SETTINGS" && (
                <AccountSettingsCards
                    classNames={classNames}
                    localization={localization}
                />
            )}

            {view === "SECURITY" && (
                <SecuritySettingsCards
                    classNames={classNames}
                    localization={localization}
                />
            )}

            {view === "API_KEYS" && apiKey && (
                <div className={cn("flex w-full flex-col", classNames?.cards)}>
                    <APIKeysCard
                        classNames={classNames?.card}
                        localization={localization}
                    />
                </div>
            )}

            {view === "ORGANIZATION" && organization && (
                <OrganizationSettingsCards
                    classNames={classNames}
                    localization={localization}
                />
            )}

            {view === "ORGANIZATION_API_KEYS" && organization?.apiKey && (
                <div className={cn("flex w-full flex-col", classNames?.cards)}>
                    <APIKeysCard
                        classNames={classNames?.card}
                        localization={localization}
                        organizationId={activeOrganization?.id}
                    />
                </div>
            )}

            {view === "ORGANIZATIONS" && organization && (
                <div className={cn("flex w-full flex-col", classNames?.cards)}>
                    <OrganizationsCard
                        classNames={classNames?.card}
                        localization={localization}
                    />
                </div>
            )}

            {view === "MEMBERS" && organization && (
                <div
                    className={cn(
                        "flex w-full flex-col gap-4 md:gap-6",
                        classNames?.cards
                    )}
                >
                    <OrganizationMembersCard
                        classNames={classNames?.card}
                        localization={localization}
                    />

                    <OrganizationInvitationsCard
                        classNames={classNames?.card}
                        localization={localization}
                    />
                </div>
            )}
        </div>
    )
}
