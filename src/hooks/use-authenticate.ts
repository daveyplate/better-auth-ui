import { useContext, useEffect } from "react"
import { AuthUIContext } from "../lib/auth-ui-provider"
import type { AuthViewPath } from "../server"
import type { AnyAuthClient } from "../types/any-auth-client"

interface AuthenticateOptions<TAuthClient extends AnyAuthClient> {
    authClient?: TAuthClient
    authView?: AuthViewPath
    enabled?: boolean
}

export function useAuthenticate<TAuthClient extends AnyAuthClient>(
    options?: AuthenticateOptions<TAuthClient>
) {
    type Session = TAuthClient["$Infer"]["Session"]["session"]
    type User = TAuthClient["$Infer"]["Session"]["user"]

    const { authView = "SIGN_IN", enabled = true } = options ?? {}

    const {
        hooks: { useSession },
        basePath,
        viewPaths,
        replace
    } = useContext(AuthUIContext)

    const { data, isPending, error, refetch } = useSession()
    const sessionData = data as
        | {
              session: Session
              user: User
          }
        | null
        | undefined

    useEffect(() => {
        if (!enabled || isPending || sessionData) return

        const currentUrl = new URL(window.location.href)
        const redirectTo = currentUrl.searchParams.get("redirectTo") || window.location.href.replace(window.location.origin, "")

        replace(
            `${basePath}/${viewPaths[authView]}?redirectTo=${redirectTo}`
        )
    }, [
        isPending,
        sessionData,
        basePath,
        viewPaths,
        replace,
        authView,
        enabled
    ])

    return {
        data: sessionData,
        user: sessionData?.user,
        isPending,
        error,
        refetch
    }
}
