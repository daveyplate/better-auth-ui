import { Loader2 } from "lucide-react"
import { useFormStatus } from "react-dom"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"

import type { authLocalization } from "./auth-card"

export function ActionButton({
    className,
    isLoading,
    localization,
    authView
}: {
    className?: string,
    isLoading?: boolean,
    localization: Partial<typeof authLocalization>,
    authView: string
}) {
    const { pending } = useFormStatus()

    return (
        <Button
            className={cn("w-full", className)}
            disabled={pending || isLoading}
        >
            {(pending || isLoading) ? (
                <Loader2 className="animate-spin" />
            ) : (
                localization[authView + "Action" as keyof typeof localization]
            )}
        </Button>
    )
}