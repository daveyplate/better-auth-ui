import { magicLinkClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export type AnyAuthClient = ReturnType<typeof createAuthClient>

const authClient = createAuthClient({
  plugins: [magicLinkClient()]
})

export type AuthClient = typeof authClient
