"use client"

import { CheckIcon, CopyIcon } from "lucide-react"
import { useState } from "react"
import type { AuthLocalization } from "../../lib/auth-localization"
import { Button } from "../ui/button"
import { CardContent } from "../ui/card"

interface BackupCodesDisplayProps {
    codes: string[]
    className?: string
    /**
     * @default authLocalization
     * @remarks `AuthLocalization`
     */
    localization?: Partial<AuthLocalization>
}

export function BackupCodesDisplay({ codes, className, localization }: BackupCodesDisplayProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        const codeText = codes.join("\n")
        navigator.clipboard.writeText(codeText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
                {codes.map((code, index) => (
                    <div
                        key={index}
                        className="rounded-md bg-muted p-2 text-center font-mono text-sm"
                    >
                        {code}
                    </div>
                ))}
            </div>

            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleCopy}
                disabled={copied}
            >
                {copied ? (
                    <>
                        <CheckIcon className="mr-2 h-4 w-4" />
                        {localization?.copied}
                    </>
                ) : (
                    <>
                        <CopyIcon className="mr-2 h-4 w-4" />
                        {localization?.copyAllCodes}
                    </>
                )}
            </Button>
        </CardContent>
    )
}
