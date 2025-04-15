"use client"

import { useContext, useState } from "react"
import type { AuthLocalization } from "../../lib/auth-localization"
import { AuthUIContext } from "../../lib/auth-ui-provider"
import { cn } from "../../lib/utils"
import type { User } from "../../types/user"
import { PasswordInput } from "../password-input"
import { BackupCodesDisplay } from "../two-factor/backup-codes-display"
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
import { Label } from "../ui/label"
import { Skeleton } from "../ui/skeleton"
import { Switch } from "../ui/switch"
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
    const [showBackupCodesDialog, setShowBackupCodesDialog] = useState(false)
    const [backupCodes, setBackupCodes] = useState<string[]>([])
    const [isLoadingBackupCodes, setIsLoadingBackupCodes] = useState(false)
    const [showBackupCodesPasswordDialog, setShowBackupCodesPasswordDialog] = useState(false)
    const [backupCodesPassword, setBackupCodesPassword] = useState("")

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
                message: localization.passwordRequired
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

            if (response?.error) {
                toast({
                    variant: "error",
                    message: response.error.message
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
                    message: localization.noTotpUriError
                })
            }
        } catch (error) {
            toast({
                variant: "error",
                message: (error as Error).message
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
                toast({
                    variant: "success",
                    message: localization.twoFactorDisabledSuccess
                })
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

    /**
     * Handle click on the view backup codes button
     * Opens password confirmation dialog
     */
    const handleViewBackupCodes = () => {
        setShowBackupCodesPasswordDialog(true)
    }

    /**
     * Handle password confirmation for generating backup codes
     * Generates backup codes and displays them
     */
    const handleBackupCodesPasswordConfirm = async () => {
        // Validate password is provided
        if (!backupCodesPassword) {
            toast({
                variant: "error",
                message: localization.passwordRequired
            })
            return
        }

        setShowBackupCodesPasswordDialog(false)
        setIsLoadingBackupCodes(true)
        setShowBackupCodesDialog(true)

        try {
            // @ts-expect-error Optional plugin
            const response = await authClient.twoFactor.generateBackupCodes({
                password: backupCodesPassword
            })

            if (response?.error) {
                toast({
                    variant: "error",
                    message: response.error.message
                })
                setShowBackupCodesDialog(false)
            } else if (response.data?.backupCodes) {
                setBackupCodes(response.data.backupCodes)
            }
        } catch (error) {
            toast({
                variant: "error",
                message: (error as Error).message
            })
            setShowBackupCodesDialog(false)
        } finally {
            setIsLoadingBackupCodes(false)
            setBackupCodesPassword("") // Reset password
        }
    }

    // Show skeleton while loading
    if (isPending) {
        return <ProvidersCardSkeleton className={className} classNames={classNames} />
    }

    return (
        <>
            <Card className={cn("w-full pb-0 text-start", className, classNames?.base)}>
                <CardHeader className={classNames?.header}>
                    <CardTitle className={cn("text-lg md:text-xl", classNames?.title)}>
                        {localization.twoFactor}
                    </CardTitle>
                </CardHeader>
                <CardContent className={cn(classNames?.content)}>
                    <CardDescription className={cn("text-xs md:text-sm", classNames?.description)}>
                        {twoFactorEnabled
                            ? localization.twoFactorEnabledInstructions
                            : localization.twoFactorDescription}
                    </CardDescription>

                    {twoFactorEnabled && (
                        <div className="mt-4">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleViewBackupCodes}
                                disabled={isLoadingBackupCodes}
                            >
                                {localization.backupCodes}
                            </Button>
                        </div>
                    )}
                </CardContent>
                <CardFooter
                    className={cn(
                        "flex flex-col justify-between gap-4 rounded-b-xl border-t bg-muted pb-6 md:flex-row dark:bg-transparent",
                        classNames?.footer
                    )}
                >
                    <CardDescription className={cn("text-xs md:text-sm", classNames?.instructions)}>
                        {twoFactorEnabled
                            ? localization.twoFactorDisableInstructions
                            : localization.twoFactorEnableInstructions}
                    </CardDescription>
                    <div className="flex items-center gap-2">
                        <Switch
                            id="two-factor-toggle"
                            checked={twoFactorEnabled}
                            onCheckedChange={(checked: boolean) => {
                                if (checked) {
                                    handleEnableClick()
                                } else {
                                    handleDisableClick()
                                }
                            }}
                            disabled={isLoading}
                            className={cn(classNames?.button)}
                        />
                    </div>
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
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            if (password) {
                                handlePasswordConfirm()
                            }
                        }}
                    >
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="password">{localization.password}</Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    placeholder={localization.passwordPlaceholder}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowPasswordDialog(false)}
                            >
                                {localization.cancel}
                            </Button>
                            <Button type="submit" disabled={!password}>
                                {localization.confirm}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{localization.confirmPassword}</DialogTitle>
                        <DialogDescription>
                            {localization.twoFactorDisableConfirmDescription}
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            if (disablePassword) {
                                handleDisableConfirm()
                            }
                        }}
                    >
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="disablePassword">{localization.password}</Label>
                                <PasswordInput
                                    id="disablePassword"
                                    name="disablePassword"
                                    placeholder={localization.passwordPlaceholder}
                                    value={disablePassword}
                                    onChange={(e) => setDisablePassword(e.target.value)}
                                    autoComplete="current-password"
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowDisableDialog(false)}
                            >
                                {localization.cancel}
                            </Button>
                            <Button type="submit" disabled={!disablePassword} variant="destructive">
                                {localization.disable}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={showBackupCodesPasswordDialog}
                onOpenChange={setShowBackupCodesPasswordDialog}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{localization.confirmPassword}</DialogTitle>
                        <DialogDescription>
                            {localization.backupCodesPasswordDescription}
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            if (backupCodesPassword) {
                                handleBackupCodesPasswordConfirm()
                            }
                        }}
                    >
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="backupCodesPassword">{localization.password}</Label>
                                <PasswordInput
                                    id="backupCodesPassword"
                                    name="backupCodesPassword"
                                    placeholder={localization.passwordPlaceholder}
                                    value={backupCodesPassword}
                                    onChange={(e) => setBackupCodesPassword(e.target.value)}
                                    autoComplete="current-password"
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowBackupCodesPasswordDialog(false)}
                            >
                                {localization.cancel}
                            </Button>
                            <Button type="submit" disabled={!backupCodesPassword}>
                                {localization.confirm}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={showBackupCodesDialog} onOpenChange={setShowBackupCodesDialog}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{localization.backupCodes}</DialogTitle>
                        <DialogDescription>{localization.backupCodesDescription}</DialogDescription>
                    </DialogHeader>

                    {isLoadingBackupCodes ? (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-2">
                                {Array.from({ length: 10 }).map((_, index) => (
                                    <Skeleton key={index} className="h-10 w-full" />
                                ))}
                            </div>
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    ) : backupCodes.length > 0 ? (
                        <BackupCodesDisplay codes={backupCodes} localization={localization} />
                    ) : null}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowBackupCodesDialog(false)}
                        >
                            {localization.cancel}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
