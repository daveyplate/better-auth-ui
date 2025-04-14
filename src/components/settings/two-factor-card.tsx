"use client"

import { Loader2 } from "lucide-react"
import { useContext, useState } from "react"
import type { AuthLocalization } from "../../lib/auth-localization"
import { AuthUIContext } from "../../lib/auth-ui-provider"
import { cn } from "../../lib/utils"
import type { User } from "../../types/user"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import type { SettingsCardClassNames } from "./settings-card"
import { ProvidersCardSkeleton } from "./skeletons/providers-card-skeleton"

/**
 * Props for the TwoFactorCard component
 * Allows customization of appearance and behavior
 */
export interface TwoFactorCardProps {
    className?: string
    classNames?: SettingsCardClassNames
    isPending?: boolean
    /**
     * @default authLocalization
     * @remarks `AuthLocalization`
     */
    localization?: AuthLocalization
    /**
     * Skip using internal hooks for fetching two factor data
     * @default false
     */
    skipHook?: boolean
    /**
     * Is two factor authentication enabled (used with skipHook)
     */
    twoFactorEnabled?: boolean
    /**
     * Function to refresh data after changes
     */
    refetch?: () => Promise<void>
}

/**
 * TwoFactorCard component for enabling/disabling two-factor authentication
 * Displays the current 2FA status and provides controls to change it
 */
export function TwoFactorCard({
    className,
    classNames,
    isPending: propIsPending,
    localization: propLocalization,
    skipHook,
    twoFactorEnabled: propTwoFactorEnabled,
    refetch
}: TwoFactorCardProps) {
    // Local state for managing loading states and dialogs
    const [isLoading, setIsLoading] = useState(false)
    const [showPasswordDialog, setShowPasswordDialog] = useState(false)
    const [password, setPassword] = useState("")
    const [showDisableDialog, setShowDisableDialog] = useState(false)
    const [disablePassword, setDisablePassword] = useState("")

    // Get required context values from AuthUIContext
    const {
        authClient,
        basePath,
        hooks: { useSession },
        localization: authLocalization,
        viewPaths,
        navigate,
        toast
    } = useContext(AuthUIContext)

    // Merge localizations with defaults
    const localization = { ...authLocalization, ...propLocalization }

    // Initialize state variables
    const twoFactorEnabled = propTwoFactorEnabled
    let isPending = propIsPending

    // If not skipping hooks, use useSession to fetch user data
    if (!skipHook) {
        const { data: session, isPending: sessionPending } = useSession?.() || {
            data: null,
            isPending: false
        }
        const user = session?.user as User | undefined

        isPending = sessionPending
    }

    /**
     * Handle click on the enable button
     * Opens password confirmation dialog
     */
    const handleEnableClick = () => {
        // Open the password confirmation dialog directly
        setShowPasswordDialog(true)
    }

    /**
     * Handle password confirmation when enabling 2FA
     * Generates a new TOTP URI and redirects to setup page
     */
    const handlePasswordConfirm = async () => {
        // Validate password is provided
        if (!password) {
            toast({
                variant: "error",
                message: localization.passwordRequired || "Password is required"
            })
            return
        }

        setShowPasswordDialog(false)
        setIsLoading(true)

        try {
            // Generate a new URI and enable two-factor authentication with the password
            // @ts-expect-error Optional plugin
            const response = await authClient.twoFactor.enable({
                password
            })
            
            console.log("2FA Enable response:", response)

            if (response?.error) {
                toast({
                    variant: "error",
                    message: response.error.message || "Failed to enable two-factor authentication"
                })
            } else if (response.data?.totpURI) {
                // Store URI in session storage for the setup page
                sessionStorage.setItem("twoFactorSetupURI", response.data.totpURI)
                sessionStorage.setItem("shouldRefreshAfterTwoFactorSetup", "true")
                
                // Store reference to the callback function to refresh data
                if (refetch) {
                    sessionStorage.setItem("twoFactorRefetchFunction", "custom")
                }

                // Redirect to setup page
                navigate(`${basePath}/${viewPaths.twoFactorSetup}`)
            } else {
                toast({
                    variant: "error",
                    message: localization.noTotpUriError || "No TOTP URI received from server"
                })
            }
        } catch (error) {
            toast({
                variant: "error",
                message: (error as Error).message || "Failed to navigate to two-factor setup"
            })
        } finally {
            setIsLoading(false)
            setPassword("") // Reset password
        }
    }

    /**
     * Handle click on the disable button
     * Opens disable confirmation dialog
     */
    const handleDisableClick = () => {
        setShowDisableDialog(true)
    }

    /**
     * Handle password confirmation when disabling 2FA
     * Disables two-factor authentication and refreshes data
     */
    const handleDisableConfirm = async () => {
        // Validate password is provided
        if (!disablePassword) {
            toast({
                variant: "error",
                message: localization.passwordRequired
            })
            return
        }

        setShowDisableDialog(false)
        setIsLoading(true)

        try {
            // Call API to disable two-factor authentication
            // @ts-ignore Optional plugin
            const { error } = await authClient.twoFactor.disable({
                password: disablePassword
            })

            if (error) {
                toast({ variant: "error", message: error.message || error.statusText })
            } else {
                toast({ variant: "success", message: localization.twoFactorDisabledSuccess })
                // Refresh data after successful operation
                await refetch?.()
            }
        } catch (error) {
            toast({
                variant: "error",
                message: (error as Error).message || "Failed to disable two-factor authentication"
            })
        } finally {
            setIsLoading(false)
            setDisablePassword("") // Reset password
        }
    }

    // Show skeleton while loading
    if (isPending) {
        return <ProvidersCardSkeleton className={className} classNames={classNames} />
    }

    return (
        <>
            <Card className={cn("w-full", className, classNames?.base)}>
                <CardHeader className={classNames?.header}>
                    <CardTitle className={cn("text-lg md:text-xl", classNames?.title)}>
                        {localization.twoFactor}
                    </CardTitle>
                    <CardDescription className={cn("text-xs md:text-sm", classNames?.description)}>
                    {twoFactorEnabled
                                ? localization.twoFactorEnabledText
                                : localization.twoFactorDescription}            
                    </CardDescription>
                </CardHeader>
                <CardContent className={cn(classNames?.content)}>
                    <div className="space-y-2">
                        {twoFactorEnabled && (
                            <p className="text-muted-foreground text-sm">
                                {localization.twoFactorEnabledInstructions}
                            </p>
                        )}
                    </div>
                </CardContent>
                <CardFooter
                    className={cn(
                        "flex justify-end rounded-b-xl border-t bg-muted pb-6 dark:bg-transparent",
                        classNames?.footer
                    )}
                >
                    <Button
                        className={cn(classNames?.button)}
                        onClick={twoFactorEnabled ? handleDisableClick : handleEnableClick}
                        disabled={isLoading}
                        variant={twoFactorEnabled ? "destructive" : "default"}
                        size="sm"
                    >
                        <span className={isLoading ? "opacity-0" : "opacity-100"}>
                            {twoFactorEnabled
                                ? localization.disableTwoFactor
                                : localization.enableTwoFactor}
                        </span>

                        {isLoading && (
                            <span className="absolute">
                                <Loader2 className="animate-spin" />
                            </span>
                        )}
                    </Button>
                </CardFooter>
            </Card>

            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{localization.confirmPassword}</DialogTitle>
                        <DialogDescription>
                            {localization.twoFactorConfirmPasswordDescription}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="password">{localization.password}</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder={localization.passwordPlaceholder}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && password) {
                                        handlePasswordConfirm()
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                            {localization.cancel}
                        </Button>
                        <Button onClick={handlePasswordConfirm} disabled={!password}>
                            {localization.confirm}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{localization.confirmPassword}</DialogTitle>
                        <DialogDescription>
                            {localization.twoFactorDisableConfirmDescription || "For security reasons, please enter your password to disable two-factor authentication."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="disablePassword">{localization.password}</Label>
                            <Input
                                id="disablePassword"
                                type="password"
                                placeholder={localization.passwordPlaceholder}
                                value={disablePassword}
                                onChange={(e) => setDisablePassword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && disablePassword) {
                                        handleDisableConfirm()
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDisableDialog(false)}>
                            {localization.cancel}
                        </Button>
                        <Button onClick={handleDisableConfirm} disabled={!disablePassword} variant="destructive">
                            {localization.disable || "Disable"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
