"use client"

import { KeyIcon } from "lucide-react"
import { useContext, useState } from "react"

import type { AuthLocalization } from "../../../lib/auth-localization"
import { AuthUIContext } from "../../../lib/auth-ui-provider"
import { cn } from "../../../lib/utils"
import type { ApiKey } from "../../../types/api-key"
import { Button } from "../../ui/button"
import { Card } from "../../ui/card"
import type { SettingsCardClassNames } from "../shared/settings-card"
import { ApiKeyDeleteDialog } from "./api-key-delete-dialog"

export interface APIKeyCellProps {
    className?: string
    classNames?: SettingsCardClassNames
    localization?: Partial<AuthLocalization>
    apiKey: ApiKey
    refetch?: () => Promise<void>
}

export function APIKeyCell({
    className,
    classNames,
    localization,
    apiKey,
    refetch
}: APIKeyCellProps) {
    const { localization: contextLocalization } = useContext(AuthUIContext)

    localization = { ...contextLocalization, ...localization }
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    // Format expiration date or show "Never expires"
    const formatExpiration = () => {
        if (!apiKey.expiresAt) return localization.neverExpires

        const expiresDate = new Date(apiKey.expiresAt)
        return `${localization.expires} ${expiresDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        })}`
    }

    return (
        <>
            <Card className={cn("flex-row items-center p-4", className, classNames?.cell)}>
                <div className="flex items-center gap-3">
                    <KeyIcon className={cn("size-4", classNames?.icon)} />

                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">{apiKey.name}</span>

                            <span className="text-muted-foreground text-sm">
                                {apiKey.start}
                                {"******"}
                            </span>
                        </div>

                        <div className="text-muted-foreground text-sm">{formatExpiration()}</div>
                    </div>
                </div>

                <Button
                    className={cn(
                        "relative ms-auto",
                        classNames?.button,
                        classNames?.outlineButton
                    )}
                    size="sm"
                    variant="outline"
                    onClick={() => setShowDeleteDialog(true)}
                >
                    {localization.delete}
                </Button>
            </Card>

            <ApiKeyDeleteDialog
                apiKey={apiKey}
                classNames={classNames}
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                refetch={refetch}
            />
        </>
    )
}
