"use client"

import { useContext } from "react"

import type { AuthLocalization } from "../../lib/auth-localization"
import { AuthUIContext } from "../../lib/auth-ui-provider"
import type { SettingsCardClassNames } from "./shared/settings-card"
import { UpdateFieldCard } from "./shared/update-field-card"

export interface UpdateNameCardProps {
    className?: string
    classNames?: SettingsCardClassNames
    isPending?: boolean
    localization?: AuthLocalization
    onSuccess?: () => void
}

export function UpdateNameCard({
    className,
    classNames,
    isPending,
    localization,
    onSuccess
}: UpdateNameCardProps) {
    const {
        hooks: { useSession },
        localization: contextLocalization,
        nameRequired
    } = useContext(AuthUIContext)

    localization = { ...contextLocalization, ...localization }

    const { data: sessionData } = useSession()

    return (
        <UpdateFieldCard
            className={className}
            classNames={classNames}
            value={sessionData?.user.name}
            description={localization.nameDescription}
            name="name"
            instructions={localization.nameInstructions}
            isPending={isPending}
            label={localization.name}
            localization={localization}
            placeholder={localization.namePlaceholder}
            required={nameRequired}
            onSuccess={onSuccess}
        />
    )
}
