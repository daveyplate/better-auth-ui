import { createAuthHooks } from "@daveyplate/better-auth-tanstack"
import { useIsRestoring, useQueryClient } from "@tanstack/react-query"
import type { ReactNode } from "react"

import { AuthUIProvider, type AuthUIProviderProps } from "../../lib/auth-ui-provider"

export function AuthUIProviderTanstack({
    children,
    authClient,
    onSessionChange,
    ...props
}: {
    children: ReactNode
} & AuthUIProviderProps) {
    const { useListAccounts, useListDeviceSessions, useListSessions, useSession } = createAuthHooks(authClient)
    const queryClient = useQueryClient()

    return (
        <AuthUIProvider
            authClient={authClient}
            // @ts-expect-error Ignore these types because they will never perfectly match
            hooks={{ useIsRestoring, useListAccounts, useListDeviceSessions, useListSessions, useSession }}
            onSessionChange={() => {
                queryClient.clear()
                onSessionChange?.()
            }}
            {...props}
        >
            {children}
        </AuthUIProvider>
    )
}