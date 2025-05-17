import type { User as AnyUser } from "better-auth"
import type { ApiKey } from "./api-key"
import type { Session, User } from "./auth-client"
import type { FetchError } from "./fetch-error"

type AuthHook<T> = {
    isPending: boolean
    data?: T | null
    error?: FetchError | null
    // biome-ignore lint/suspicious/noExplicitAny:
    refetch?: () => Promise<any> | any
}

export type AuthHooks = {
    useSession: () => AuthHook<{ session: Session; user: User }>
    useListAccounts: () => AuthHook<{ accountId: string; provider: string }[]>
    useListDeviceSessions: () => AuthHook<{ session: Session; user: AnyUser }[]>
    useListSessions: () => AuthHook<Session[]>
    useListPasskeys: () => AuthHook<{ id: string; createdAt: Date }[]>
    useListApiKeys: () => AuthHook<ApiKey[]>
    useIsRestoring?: () => boolean
}
