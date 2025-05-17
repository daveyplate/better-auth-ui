type MutateFn<T = Record<string, unknown>> = (params: T) => Promise<unknown> | Promise<void>

export interface AuthMutators {
    deleteApiKey: MutateFn<{ keyId: string }>
    deletePasskey: MutateFn<{ id: string }>
    revokeDeviceSession: MutateFn<{ sessionToken: string }>
    revokeSession: MutateFn<{ token: string }>
    setActiveSession: MutateFn<{ sessionToken: string }>
    updateUser: MutateFn
    unlinkAccount: MutateFn<{ providerId: string; accountId?: string }>
}
