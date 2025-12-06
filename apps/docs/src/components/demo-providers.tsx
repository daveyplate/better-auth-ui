import { AuthProvider } from "@better-auth-ui/heroui"
import { createAuthClient } from "better-auth/react"

const authClient = createAuthClient({
  fetchOptions: {
    customFetchImpl: async () => new Response()
  }
})

export function DemoProviders({ children }: { children: React.ReactNode }) {
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
