"use client"

import { QRCodeSVG } from "qrcode.react"
import { useContext, useEffect, useState } from "react"
import type { AuthLocalization } from "../../lib/auth-localization"
import { AuthUIContext } from "../../lib/auth-ui-provider"
import { cn } from "../../lib/utils"
import { Card, CardContent } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

interface TwoFactorQRProps {
    uri: string
    size?: number
    className?: string
    /**
     * @default authLocalization
     * @remarks `AuthLocalization`
     */
    localization?: Partial<AuthLocalization>
}

export function TwoFactorQR({ uri, size = 200, className, localization: propLocalization }: TwoFactorQRProps) {
    const [mounted, setMounted] = useState(false)
    const { localization: authLocalization } = useContext(AuthUIContext)
    const localization = { ...authLocalization, ...propLocalization }

    useEffect(() => {
        setMounted(true)
    }, [uri])

    // If URI is empty, display an error message
    if (!uri) {
        return (
            <Card className={cn("w-full max-w-[240px]", className)}>
                <CardContent className="flex items-center justify-center p-4">
                    <div className="text-destructive text-sm">
                        {localization.qrCodeMissing}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className={cn("w-full max-w-[240px]", className)}>
            <CardContent className="overflow-hidden">
                <div
                    className="relative flex items-center justify-center"
                    style={{ width: size, height: size }}
                >
                    {!mounted ? (
                        <Skeleton className="h-full w-full rounded-md" />
                    ) : (
                        <QRCodeSVG
                            value={uri}
                            size={size}
                            level="H"
                            fgColor="currentColor"
                            bgColor="transparent"
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
