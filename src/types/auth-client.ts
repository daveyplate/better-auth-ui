import type {
    anonymousClient,
    apiKeyClient,
    emailOTPClient,
    genericOAuthClient,
    magicLinkClient,
    multiSessionClient,
    oneTapClient,
    passkeyClient,
    twoFactorClient,
    usernameClient
} from "better-auth/client/plugins"
import type { createAuthClient } from "better-auth/react"

type ApiKeyClientPlugin = ReturnType<typeof apiKeyClient>
type MultiSessionClientPlugin = ReturnType<typeof multiSessionClient>
type PasskeyClientPlugin = ReturnType<typeof passkeyClient>
type OneTapClientPlugin = ReturnType<typeof oneTapClient>
type GenericOAuthClientPlugin = ReturnType<typeof genericOAuthClient>
type AnonymousClientPlugin = ReturnType<typeof anonymousClient>
type UsernameClientPlugin = ReturnType<typeof usernameClient>
type MagicLinkClientPlugin = ReturnType<typeof magicLinkClient>
type EmailOTPClientPlugin = ReturnType<typeof emailOTPClient>
type TwoFactorClientPlugin = ReturnType<typeof twoFactorClient>

export type AuthClient = ReturnType<
    typeof createAuthClient<{
        plugins: [
            ApiKeyClientPlugin,
            MultiSessionClientPlugin,
            PasskeyClientPlugin,
            OneTapClientPlugin,
            GenericOAuthClientPlugin,
            AnonymousClientPlugin,
            UsernameClientPlugin,
            MagicLinkClientPlugin,
            EmailOTPClientPlugin,
            TwoFactorClientPlugin
        ]
    }>
>

export type Session = AuthClient["$Infer"]["Session"]["session"]
export type User = AuthClient["$Infer"]["Session"]["user"]
