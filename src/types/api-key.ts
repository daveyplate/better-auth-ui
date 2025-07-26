export type ApiKey = {
    id: string
    name?: string | null
    start?: string | null
    expiresAt?: Date | null
    createdAt: Date
    updatedAt: Date
    metadata?: Record<string, unknown> | null
}
