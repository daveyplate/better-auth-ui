"use client"

import { Copy } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import type { AuthLocalization } from "../../lib/auth-localization"
import { AuthUIContext } from "../../lib/auth-ui-provider"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"

interface TwoFactorRecoveryProps {
    className?: string
    /**
     * @default authLocalization
     * @remarks `AuthLocalization`
     */
    localization?: Partial<AuthLocalization>
}

export function TwoFactorRecovery({
    className,
    localization: propLocalization
}: TwoFactorRecoveryProps) {
    const [backupCodes, setBackupCodes] = useState<string[]>([])
    const [shouldRefresh, setShouldRefresh] = useState(false)
    
    const { 
        basePath, 
        viewPaths,
        localization: authLocalization,
        hooks: { useSession },
        navigate
    } = useContext(AuthUIContext)
    
    const localization = { ...authLocalization, ...propLocalization }
    
    // Load backup codes from sessionStorage
    useEffect(() => {
        const codesString = sessionStorage.getItem("twoFactorBackupCodes")
        if (codesString) {
            try {
                const codes = JSON.parse(codesString)
                if (Array.isArray(codes)) {
                    setBackupCodes(codes)
                }
            } catch (error) {
                console.error("Error parsing backup codes", error)
            }
        }
        
        const shouldRefreshValue = sessionStorage.getItem("shouldRefreshAfterTwoFactorSetup")
        if (shouldRefreshValue === "true") {
            setShouldRefresh(true)
        }
    }, [])
    
    // Handle completion of setup
    const handleCompleteSetup = () => {
        // Clean up sessionStorage
        sessionStorage.removeItem("twoFactorBackupCodes")
        sessionStorage.removeItem("shouldRefreshAfterTwoFactorSetup")
        
        // Refresh session if needed
        if (shouldRefresh && useSession) {
            const { refetch } = useSession()
            refetch?.()
        }
        
        // Navigate to settings or appropriate page
        if (navigate) {
            navigate(`${basePath}/${viewPaths.settings}`)
        }
    }
    
    const copyAllCodes = () => {
        if (backupCodes?.length) {
            navigator.clipboard.writeText(backupCodes.join("\n"))
        }
    }
    
    return (
        <Card className={cn("w-full max-w-md", className)}>
            <CardHeader>
                <CardTitle>{localization.backupCodes}</CardTitle>
                <CardDescription>
                    {localization.backupCodesDescription}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground">
                        {localization.recoveryCodesWarning}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2">
                        {backupCodes.map((code, index) => (
                            <div 
                                key={index} 
                                className="bg-muted p-2 rounded-md text-center font-mono text-sm"
                            >
                                {code}
                            </div>
                        ))}
                    </div>
                    
                    <Button 
                        variant="outline" 
                        className="flex items-center gap-2 w-full"
                        onClick={copyAllCodes}
                    >
                        <Copy className="h-4 w-4" />
                        {localization.copyRecoveryCodes}
                    </Button>
                    
                    <Separator />
                    
                    <p className="text-sm text-center text-muted-foreground">
                        {localization.twoFactorEnabledDescription}
                    </p>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={handleCompleteSetup}>
                    {localization.completeSetup}
                </Button>
            </CardFooter>
        </Card>
    )
} 