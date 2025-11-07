"use client"

import { type ReactNode, useContext } from "react"
import { AuthUIContext } from "../lib/auth-ui-provider"

/**
 * Conditionally renders content for unauthenticated users only
 *
 * Renders its children only when no user is authenticated and the authentication
 * state is not pending. If a session exists or is being loaded, nothing is rendered.
 * Useful for displaying sign-in prompts or content exclusive to guests.
 */
export function SignedOut({ children, treatPendingAsSignedOut=false }: { children: ReactNode, treatPendingAsSignedOut?: boolean }) {
    const {
        hooks: { useSession }
    } = useContext(AuthUIContext)
    const { data, isPending } = useSession();

    if(treatPendingAsSignedOut)
        return !data || isPending ? children : null

    return !data && !isPending ? children : null
}
