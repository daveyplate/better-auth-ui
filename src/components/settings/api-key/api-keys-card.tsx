"use client"

import { useContext, useMemo, useState } from "react"
import { AuthUIContext } from "../../../lib/auth-ui-provider"
import { cn } from "../../../lib/utils"
import { CardContent } from "../../ui/card"
import { SettingsCard } from "../shared/settings-card"
import type { SettingsCardProps } from "../shared/settings-card"
import { APIKeyCell } from "./api-key-cell"
import { APIKeyDisplayDialog } from "./api-key-display-dialog"
import { CreateAPIKeyDialog } from "./create-api-key-dialog"

export interface APIKeysCardProps extends SettingsCardProps {
    organizationId?: string
}

export function APIKeysCard({
    className,
    classNames,
    localization,
    organizationId,
    ...props
}: APIKeysCardProps) {
    const {
        hooks: { useListApiKeys },
        localization: contextLocalization
    } = useContext(AuthUIContext)

    localization = { ...contextLocalization, ...localization }

    const { data: apiKeys, isPending, refetch } = useListApiKeys()

    // Filter API keys by organizationId
    const filteredApiKeys = useMemo(() => {
        return apiKeys?.filter(
            (apiKey) => organizationId === apiKey.metadata?.organizationId
        )
    }, [apiKeys, organizationId])

    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [displayDialogOpen, setDisplayDialogOpen] = useState(false)
    const [createdApiKey, setCreatedApiKey] = useState("")

    const handleCreateApiKey = (apiKey: string) => {
        setCreatedApiKey(apiKey)
        setDisplayDialogOpen(true)
    }

    return (
        <>
            <SettingsCard
                className={className}
                classNames={classNames}
                actionLabel={localization.CREATE_API_KEY}
                description={localization.API_KEYS_DESCRIPTION}
                instructions={localization.API_KEYS_INSTRUCTIONS}
                isPending={isPending}
                title={localization.API_KEYS}
                action={() => setCreateDialogOpen(true)}
                {...props}
            >
                {filteredApiKeys && filteredApiKeys.length > 0 && (
                    <CardContent
                        className={cn("grid gap-4", classNames?.content)}
                    >
                        {filteredApiKeys?.map((apiKey) => (
                            <APIKeyCell
                                key={apiKey.id}
                                classNames={classNames}
                                apiKey={apiKey}
                                localization={localization}
                                refetch={refetch}
                            />
                        ))}
                    </CardContent>
                )}
            </SettingsCard>

            <CreateAPIKeyDialog
                classNames={classNames}
                localization={localization}
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSuccess={handleCreateApiKey}
                refetch={refetch}
                organizationId={organizationId}
            />

            <APIKeyDisplayDialog
                classNames={classNames}
                apiKey={createdApiKey}
                localization={localization}
                open={displayDialogOpen}
                onOpenChange={setDisplayDialogOpen}
            />
        </>
    )
}
