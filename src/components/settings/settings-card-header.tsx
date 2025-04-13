"use client"

import type { ReactNode } from "react"

import { cn } from "../../lib/utils"
import { CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import type { SettingsCardClassNames } from "./settings-card"

export interface SettingsCardHeaderProps {
    /**
     * Title for the card
     */
    title: ReactNode
    /**
     * Description text for the card
     */
    description?: ReactNode
    /**
     * Whether the card is in a loading state and should show skeletons
     */
    isPending?: boolean
    /**
     * Class names for styling
     */
    classNames?: SettingsCardClassNames
    className?: string
}

export function SettingsCardHeader({
    title,
    description,
    isPending,
    classNames,
    className
}: SettingsCardHeaderProps) {
    return (
        <CardHeader className={cn(classNames?.header, className)}>
            {isPending ? (
                <>
                    <Skeleton className={cn("my-0.5 h-5 w-1/3 md:h-5.5", classNames?.skeleton)} />
                    {description && (
                        <Skeleton
                            className={cn("mt-1.5 mb-0.5 h-3 w-2/3 md:h-3.5", classNames?.skeleton)}
                        />
                    )}
                </>
            ) : (
                <>
                    <CardTitle className={cn("text-lg md:text-xl", classNames?.title)}>
                        {title}
                    </CardTitle>

                    {description && (
                        <CardDescription
                            className={cn("text-xs md:text-sm", classNames?.description)}
                        >
                            {description}
                        </CardDescription>
                    )}
                </>
            )}
        </CardHeader>
    )
}
