"use client"

import { Loader2 } from "lucide-react"
import {
    useActionState,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react"
import { toast } from "sonner"

import { AuthUIContext } from "../../lib/auth-ui-provider"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

import { type SettingsCardClassNames } from "./settings-card"
import { settingsLocalization } from "./settings-cards"
import { ChangePasswordCardSkeleton } from "./skeletons/change-password-card-skeleton"

export function ChangePasswordCard({
    className,
    classNames,
    localization
}: {
    className?: string,
    classNames?: SettingsCardClassNames,
    localization?: Partial<typeof settingsLocalization>
}) {
    localization = { ...settingsLocalization, ...localization }

    const [credentialsLinked, setCredentialsLinked] = useState<boolean | null>(null)
    const [disabled, setDisabled] = useState(true)
    const [isSetPasswordLoading, setIsSetPasswordLoading] = useState(false)

    const { authClient, viewPaths, basePath } = useContext(AuthUIContext)
    const { data: sessionData, isPending: isSessionPending } = authClient.useSession()

    const checkCredentialsLink = useCallback(async () => {
        const { data: accounts, error } = await authClient.listAccounts()
        if (!error && accounts) {
            setCredentialsLinked(accounts.some(account => account.provider === "credentials"))
        } else {
            toast.error(error?.message || error?.statusText || "Could not load account info")
        }
    }, [authClient])

    useEffect(() => {
        if (sessionData?.user) {
            checkCredentialsLink()
        }
    }, [sessionData, checkCredentialsLink])

    const handleSetPassword = async () => {
        const email = sessionData?.user?.email
        if (!email) {
            toast.error("Email not found")
            return
        }

        setIsSetPasswordLoading(true)

        const { error } = await authClient.forgetPassword({
            email,
            redirectTo: `${basePath}/${viewPaths.resetPassword}`
        })

        setIsSetPasswordLoading(false)

        if (error) {
            toast.error(error.message || error.statusText)
        } else {
            toast.success("Check your email to set your password.")
        }
    }

    const formAction = async (_: unknown, formData: FormData) => {
        const currentPassword = formData.get("currentPassword") as string
        const newPassword = formData.get("newPassword") as string

        const { error } = await authClient.changePassword({
            currentPassword,
            newPassword,
            revokeOtherSessions: true
        })

        if (error) {
            toast.error(error.message || error.statusText)
        } else {
            toast.success(localization.changePasswordSuccess)
        }
    }

    const [_, action, isSubmitting] = useActionState(formAction, null)

    if (isSessionPending || credentialsLinked === null) {
        return <ChangePasswordCardSkeleton className={className} classNames={classNames} />
    }

    // If no credentials provider, show Set Password CTA
    if (!credentialsLinked) {
        return (
            <Card className={cn("w-full max-w-lg overflow-hidden", className, classNames?.base)}>
                <CardHeader className={classNames?.header}>
                    <CardTitle className={cn("text-lg md:text-xl", classNames?.title)}>
                        {localization.changePassword}
                    </CardTitle>

                    <CardDescription className={cn("text-xs md:text-sm", classNames?.description)}>
                        You registered using an OAuth provider. Click below to set a password for your account.
                    </CardDescription>
                </CardHeader>

                <CardFooter className={cn("border-t bg-muted dark:bg-transparent py-4 md:py-3 flex justify-end", classNames?.footer)}>
                    <Button disabled={isSetPasswordLoading} size="sm" onClick={handleSetPassword}>
                        <span className={cn(isSetPasswordLoading && "opacity-0")}>
                            Set Password
                        </span>

                        {isSetPasswordLoading && (
                            <span className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="animate-spin" />
                            </span>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    // Regular Change Password Form
    return (
        <Card className={cn("w-full max-w-lg overflow-hidden", className, classNames?.base)}>
            <form action={action}>
                <CardHeader className={classNames?.header}>
                    <CardTitle className={cn("text-lg md:text-xl", classNames?.title)}>
                        {localization.changePassword}
                    </CardTitle>

                    <CardDescription className={cn("text-xs md:text-sm", classNames?.description)}>
                        {localization.changePasswordDescription}
                    </CardDescription>
                </CardHeader>

                <CardContent className={cn("grid gap-4", classNames?.content)}>
                    <div className="grid gap-2">
                        <Label htmlFor="currentPassword">
                            {localization.currentPassword}
                        </Label>

                        <Input
                            autoComplete="current-password"
                            id="currentPassword"
                            name="currentPassword"
                            placeholder={localization.currentPasswordPlaceholder}
                            required
                            type="password"
                            onChange={() => setDisabled(false)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="newPassword">
                            {localization.newPassword}
                        </Label>

                        <Input
                            autoComplete="new-password"
                            id="newPassword"
                            name="newPassword"
                            placeholder={localization.newPasswordPlaceholder}
                            required
                            type="password"
                            onChange={() => setDisabled(false)}
                        />
                    </div>
                </CardContent>

                <CardFooter className={cn("border-t bg-muted dark:bg-transparent py-4 md:py-3 flex gap-4 justify-between", classNames?.footer)}>
                    {localization.changePasswordInstructions && (
                        <CardDescription className={cn("text-xs md:text-sm", classNames?.instructions)}>
                            {localization.changePasswordInstructions}
                        </CardDescription>
                    )}

                    <Button className="md:ms-auto relative" disabled={disabled || isSubmitting} size="sm">
                        <span className={cn(isSubmitting && "opacity-0")}>
                            {localization.save}
                        </span>

                        {isSubmitting && (
                            <span className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="animate-spin" />
                            </span>
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}