"use client"

import type { Session, User } from "better-auth"
import {
    ChevronsUpDown,
    LogInIcon,
    LogOutIcon,
    PlusCircleIcon,
    SettingsIcon,
    UserRoundPlus
} from "lucide-react"
import { Fragment, type ReactNode, useContext, useEffect, useState } from "react"

import type { AuthLocalization } from "../lib/auth-localization"
import { AuthUIContext } from "../lib/auth-ui-provider"
import { getLocalizedError } from "../lib/utils"
import { cn } from "../lib/utils"
import { Button } from "./ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "./ui/dropdown-menu"
import { UserAvatar, type UserAvatarClassNames } from "./user-avatar"
import { UserView, type UserViewClassNames } from "./user-view"

export interface UserButtonClassNames {
    base?: string
    skeleton?: string
    trigger?: {
        base?: string
        avatar?: UserAvatarClassNames
        user?: UserViewClassNames
        skeleton?: string
    }
    content?: {
        base?: string
        user?: UserViewClassNames
        avatar?: UserAvatarClassNames
        menuItem?: string
        separator?: string
    }
}

export interface UserButtonProps {
    className?: string
    classNames?: UserButtonClassNames
    additionalLinks?: {
        href: string
        icon?: ReactNode
        label: ReactNode
        signedIn?: boolean
    }[]
    disableDefaultLinks?: boolean
    /**
     * @default authLocalization
     * @remarks `AuthLocalization`
     */
    localization?: AuthLocalization
    /**
     * @default "icon"
     */
    size?: "icon" | "full"
    /**
     * @default "end"
     */
    align?: "start" | "center" | "end"
}

type DeviceSession = {
    session: Session
    user: User
}

/**
 * Displays an interactive user button with dropdown menu functionality
 *
 * Renders a user interface element that can be displayed as either an icon or full button:
 * - Shows a user avatar or placeholder when in icon mode
 * - Displays user name and email with dropdown indicator in full mode
 * - Provides dropdown menu with authentication options (sign in/out, settings, etc.)
 * - Supports multi-session functionality for switching between accounts
 * - Can be customized with additional links and styling options
 */
export function UserButton({
    className,
    classNames,
    additionalLinks,
    disableDefaultLinks,
    localization,
    size = "icon",
    align = "end"
}: UserButtonProps) {
    const {
        basePath,
        hooks: { useSession, useListDeviceSessions },
        mutators: { setActiveSession },
        localization: authLocalization,
        multiSession,
        settingsURL,
        signUp,
        toast,
        viewPaths,
        onSessionChange,
        Link
    } = useContext(AuthUIContext)

    localization = { ...authLocalization, ...localization }

    let deviceSessions: DeviceSession[] | undefined | null = null
    let deviceSessionsPending = false

    if (multiSession) {
        const { data, isPending } = useListDeviceSessions()
        deviceSessions = data
        deviceSessionsPending = isPending
    }

    const { data: sessionData, isPending: sessionPending } = useSession()
    const user = sessionData?.user
    const [activeSessionPending, setActiveSessionPending] = useState(false)

    const isPending = sessionPending || activeSessionPending

    const switchAccount = async (sessionToken: string) => {
        setActiveSessionPending(true)

        try {
            await setActiveSession({ sessionToken })
            onSessionChange?.()
        } catch (error) {
            toast({
                variant: "error",
                message: getLocalizedError({ error, localization })
            })
            setActiveSessionPending(false)
        }
    }

    // biome-ignore lint/correctness/useExhaustiveDependencies:
    useEffect(() => {
        if (!multiSession) return

        setActiveSessionPending(false)
    }, [sessionData, multiSession])

    return (
        <DropdownMenu >
            <DropdownMenuTrigger
                asChild={size === "full"}
                className={cn(size === "icon" && "rounded-full", classNames?.trigger?.base)}
            >
                {size === "icon" ? (
                    <UserAvatar
                        key={user?.image}
                        isPending={isPending}
                        className={cn("size-8", className, classNames?.base)}
                        classNames={classNames?.trigger?.avatar}
                        user={user}
                        aria-label={localization.account}
                    />
                ) : (
                    <Button
                        className={cn(
                            "h-fit justify-between",
                            className,
                            classNames?.trigger?.base
                        )}
                        variant="outline"
                    >
                        {(user && !user.isAnonymous) || isPending ? (
                            <UserView
                                user={user}
                                isPending={isPending}
                                classNames={classNames?.trigger?.user}
                            />
                        ) : (
                            <div className="flex items-center gap-2 truncate">
                                <UserAvatar className={cn("my-0.5", classNames?.trigger?.avatar)} />

                                <span className="truncate font-medium text-sm">
                                    {localization?.account}
                                </span>
                            </div>
                        )}

                        <ChevronsUpDown />
                    </Button>
                )}
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className={cn("max-w-64", classNames?.content?.base)}
                onCloseAutoFocus={(e) => e.preventDefault()}
                align={align}
            >
                <div className={cn("p-2", classNames?.content?.menuItem)}>
                    {(user && !user.isAnonymous) || isPending ? (
                        <UserView
                            user={user}
                            isPending={isPending}
                            classNames={classNames?.content?.user}
                        />
                    ) : (
                        <div className="-my-1 text-muted-foreground text-xs">
                            {localization.account}
                        </div>
                    )}
                </div>

                <DropdownMenuSeparator className={classNames?.content?.separator} />

                {additionalLinks?.map(
                    ({ href, icon, label, signedIn }, index) =>
                        (signedIn === undefined ||
                            (signedIn && !!sessionData) ||
                            (!signedIn && !sessionData)) && (
                            <Link key={index} href={href}>
                                <DropdownMenuItem className={classNames?.content?.menuItem}>
                                    {icon}

                                    {label}
                                </DropdownMenuItem>
                            </Link>
                        )
                )}

                {!user || user.isAnonymous ? (
                    <>
                        <Link href={`${basePath}/${viewPaths.signIn}`}>
                            <DropdownMenuItem className={classNames?.content?.menuItem}>
                                <LogInIcon />

                                {localization.signIn}
                            </DropdownMenuItem>
                        </Link>

                        {signUp && (
                            <Link href={`${basePath}/${viewPaths.signUp}`}>
                                <DropdownMenuItem className={classNames?.content?.menuItem}>
                                    <UserRoundPlus />

                                    {localization.signUp}
                                </DropdownMenuItem>
                            </Link>
                        )}
                    </>
                ) : (
                    <>
                        {!disableDefaultLinks && (
                            <Link href={settingsURL || `${basePath}/${viewPaths.settings}`}>
                                <DropdownMenuItem className={classNames?.content?.menuItem}>
                                    <SettingsIcon />

                                    {localization.settings}
                                </DropdownMenuItem>
                            </Link>
                        )}

                        <Link href={`${basePath}/${viewPaths.signOut}`}>
                            <DropdownMenuItem className={classNames?.content?.menuItem}>
                                <LogOutIcon />

                                {localization.signOut}
                            </DropdownMenuItem>
                        </Link>
                    </>
                )}

                {user && multiSession && (
                    <>
                        <DropdownMenuSeparator className={classNames?.content?.separator} />

                        {!deviceSessions && deviceSessionsPending && (
                            <>
                                <DropdownMenuItem
                                    disabled
                                    className={classNames?.content?.menuItem}
                                >
                                    <UserView
                                        isPending={true}
                                        classNames={classNames?.content?.user}
                                    />
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className={classNames?.content?.separator} />
                            </>
                        )}

                        {deviceSessions
                            ?.filter((sessionData) => sessionData.user.id !== user?.id)
                            .map(({ session, user }) => (
                                <Fragment key={session.id}>
                                    <DropdownMenuItem
                                        className={classNames?.content?.menuItem}
                                        onClick={() => switchAccount(session.token)}
                                    >
                                        <UserView
                                            user={user}
                                            classNames={classNames?.content?.user}
                                        />
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator
                                        className={classNames?.content?.separator}
                                    />
                                </Fragment>
                            ))}

                        <Link href={`${basePath}/${viewPaths.signIn}`}>
                            <DropdownMenuItem className={classNames?.content?.menuItem}>
                                <PlusCircleIcon />

                                {localization.addAccount}
                            </DropdownMenuItem>
                        </Link>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
