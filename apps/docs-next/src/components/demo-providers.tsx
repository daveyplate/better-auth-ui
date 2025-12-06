"use client"

import { AuthProvider } from "@better-auth-ui/heroui"
import { createAuthClient } from "better-auth/react"
import type { ReactNode } from "react"

const authClient = createAuthClient({
  fetchOptions: {
    customFetchImpl: async () => new Response()
  }
})

export function DemoProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider
      authClient={authClient}
      navigate={() => {}}
      replace={() => {}}
      Link={({ href, ...props }) => <a {...props} />}
    >
      {children}
    </AuthProvider>
  )
}
