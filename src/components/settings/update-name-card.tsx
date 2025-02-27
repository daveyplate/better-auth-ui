"use client"

import { useContext } from "react"

import { AuthUIContext } from "../../lib/auth-ui-provider"

import { type SettingsCardClassNames } from "./settings-card"
import { settingsLocalization } from "./settings-cards"
import { UpdateFieldCard } from "./update-field-card"

export function UpdateNameCard({
    className,
    classNames,
    localization
}: {
    className?: string,
    classNames?: SettingsCardClassNames,
    localization?: Partial<typeof settingsLocalization>
}) {
    localization = { ...settingsLocalization, ...localization }

    const { authClient } = useContext(AuthUIContext)
    const { data: sessionData } = authClient.useSession()

    return (
        <UpdateFieldCard
            key={sessionData?.user.name}
            className={className}
            classNames={classNames}
            defaultValue={sessionData?.user.name}
            description={localization.nameDescription}
            instructions={localization.nameInstructions}
            localization={localization}
            name="name"
            placeholder={localization.namePlaceholder}
            title={localization.name}
        />
    )
}