"use client"

import { useContext, useState } from "react"
import type { AuthLocalization } from "../../lib/auth-localization"
import { AuthUIContext } from "../../lib/auth-ui-provider"
import { cn } from "../../lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { TwoFactorInput } from "./two-factor-input"
import { Button } from "../ui/button"

interface TwoFactorPromptProps {
    className?: string
    defaultValue?: string
    error?: string
    isSubmitting?: boolean
    /**
     * @default authLocalization
     * @remarks `AuthLocalization`
     */
    localization?: Partial<AuthLocalization>
    onSubmit?: (code: string, trustDevice: boolean) => void
}

export function TwoFactorPrompt({
    className,
    defaultValue = "",
    error,
    isSubmitting = false,
    localization: propLocalization,
    onSubmit
}: TwoFactorPromptProps) {
    const [code, setCode] = useState(defaultValue)
    const [trustDevice, setTrustDevice] = useState(false)
    
    const { localization: authLocalization } = useContext(AuthUIContext)
    const localization = { ...authLocalization, ...propLocalization }
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit?.(code, trustDevice)
    }
    
    return (
        <Card className={cn("w-full max-w-md", className)}>
            <CardHeader>
                <CardTitle>{localization.twoFactorPrompt}</CardTitle>
                <CardDescription>
                    {localization.twoFactorPromptDescription}
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="twoFactorCode">
                                {localization.enterTwoFactorCode}
                            </Label>
                            <TwoFactorInput
                                id="twoFactorCode"
                                value={code}
                                onChange={setCode}
                                placeholder={localization.twoFactorCodePlaceholder}
                                maxLength={6}
                            />
                            {error && <p className="text-sm text-destructive">{error}</p>}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="trustDevice" 
                                checked={trustDevice}
                                onCheckedChange={(checked) => setTrustDevice(checked === true)}
                            />
                            <Label 
                                htmlFor="trustDevice" 
                                className="text-sm font-normal"
                            >
                                {localization.rememberDevice}
                            </Label>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={code.length < 6 || isSubmitting}
                    >
                        {isSubmitting 
                            ? localization.verifying
                            : localization.verifyTwoFactorAction}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
} 