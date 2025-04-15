"use client"

import { AlertCircle, Info } from "lucide-react"
import { useState } from "react"
import { AuthLocalization } from "../../lib/auth-localization"
import { cn } from "../../lib/utils"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { TwoFactorInput } from "./two-factor-input"

export interface TwoFactorPromptProps {
    error?: string
    isSubmitting?: boolean
    onSubmit: (code: string, trustDevice: boolean) => void
    onBackupCodeToggle?: (isBackupCode: boolean) => void
    localization: AuthLocalization
    className?: string
    isSetup?: boolean
}

export const TwoFactorPrompt = ({
    error,
    isSubmitting,
    onSubmit,
    onBackupCodeToggle,
    localization,
    className,
    isSetup = false
}: TwoFactorPromptProps) => {
    const [code, setCode] = useState("")
    const [trustDevice, setTrustDevice] = useState(false)
    const [isBackupCode, setIsBackupCode] = useState(false)

    const handleCodeChange = (newCode: string) => {
        setCode(newCode)
        if (newCode.length === (isBackupCode ? 11 : 6)) {
            onSubmit(newCode, trustDevice)
        }
    }

    const toggleBackupCode = () => {
        const newIsBackupCode = !isBackupCode
        setIsBackupCode(newIsBackupCode)
        setCode("")
        onBackupCodeToggle?.(newIsBackupCode)
    }

    return (
        <div className={cn("space-y-6", className)}>
            <div className="space-y-2">
                {isBackupCode && (
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>{localization.enterBackupCode}</AlertTitle>
                        <AlertDescription>{localization.backupCodePlaceholder}</AlertDescription>
                    </Alert>
                )}

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-6">
                    <div className="space-y-2">
                        <TwoFactorInput
                            value={code}
                            onChange={handleCodeChange}
                            maxLength={isBackupCode ? 11 : 6}
                            isBackupCode={isBackupCode}
                        />
                    </div>

                    <div className="flex flex-row items-center gap-2">
                        <Checkbox
                            id="trust-device"
                            checked={trustDevice}
                            onCheckedChange={(checked) => setTrustDevice(checked as boolean)}
                            disabled={isSubmitting}
                        />
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Label
                                        htmlFor="trust-device"
                                        className="text-sm text-muted-foreground cursor-help"
                                    >
                                        {localization.rememberDevice}
                                    </Label>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {localization.rememberDeviceDescription}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                {!isSetup && (
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    variant="link"
                                    size="sm"
                                    onClick={toggleBackupCode}
                                    className="px-0 h-auto text-xs font-medium text-muted-foreground hover:text-primary"
                                >
                                    {isBackupCode
                                        ? localization.useTwoFactorCode
                                        : localization.useBackupCode}
                                </Button>
                            </div>
                        )}
            </div>
        </div>
    )
}
