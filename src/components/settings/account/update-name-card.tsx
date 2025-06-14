"use client"

import { useContext } from "react"
import { AuthUIContext } from "../../../lib/auth-ui-provider"
import type { SettingsCardProps } from "../shared/settings-card"
import { UpdateFieldCard } from "./update-field-card"

export function UpdateNameCard({
    className,
    classNames,
    localization,
    onSave,
    ...props
}: SettingsCardProps) {
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
            description={localization.NAME_DESCRIPTION}
            name="name"
            instructions={localization.NAME_INSTRUCTIONS}
            label={localization.NAME}
            localization={localization}
            placeholder={localization.NAME_PLACEHOLDER}
            required={nameRequired}
            onSave={onSave}
            {...props}
        />
    )
}
