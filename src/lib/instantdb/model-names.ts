const namespaces = ["user", "session", "account", "passkey", "twoFactor"] as const
type Namespace = (typeof namespaces)[number]

export type ModelNames = {
    [key in Namespace]: string
}

export const getModelName = ({
    namespace,
    modelNames,
    usePlural
}: {
    namespace: Namespace
    modelNames?: Partial<ModelNames>
    usePlural?: boolean
}) => {
    return modelNames?.[namespace] || `${namespace}${usePlural ? "s" : ""}`
}
