"use client"

import { useContext } from "react"

import type { AuthLocalization } from "../../lib/auth-localization"
import { AuthUIContext } from "../../lib/auth-ui-provider"
import type { SettingsCardClassNames } from "./shared/settings-card"
import { UpdateFieldCard } from "./shared/update-field-card"

export interface UpdateUsernameCardProps {
    className?: string
    classNames?: SettingsCardClassNames
    isPending?: boolean
    localization?: AuthLocalization
    onSuccess?: () => void
}

export function UpdateUsernameCard({
    className,
    classNames,
    isPending,
    localization,
    onSuccess
}: UpdateUsernameCardProps) {
    const {
        hooks: { useSession },
        localization: contextLocalization
    } = useContext(AuthUIContext)

    localization = { ...contextLocalization, ...localization }

    const { data: sessionData } = useSession()
    const value = sessionData?.user.displayUsername || sessionData?.user.username

    return (
        <UpdateFieldCard
            className={className}
            classNames={classNames}
            value={value}
            description={localization.usernameDescription}
            name="username"
            instructions={localization.usernameInstructions}
            isPending={isPending}
            label={localization.username}
            localization={localization}
            placeholder={localization.usernamePlaceholder}
            required
            onSuccess={onSuccess}
        />
    )
}
