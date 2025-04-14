import {
    genericOAuthClient,
    multiSessionClient,
    passkeyClient,
    twoFactorClient
} from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

const authClient = createAuthClient({
    plugins: [multiSessionClient(), passkeyClient(), genericOAuthClient(), twoFactorClient()]
})

export type AuthClient = typeof authClient
