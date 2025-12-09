import { AuthProvider } from "@better-auth-ui/heroui"
import { authClient } from "@/lib/auth-client"

export function DemoProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider
      authClient={{
        ...authClient,
        useSession: () => {
          return {
            data: {
              session: {
                id: "123",
                userId: "123",
                createdAt: new Date(),
                updatedAt: new Date(),
                expiresAt: new Date(),
                token: "test-token"
              },
              user: {
                id: "123",
                name: "Seto",
                email: "seto@kaibacorp.com",
                createdAt: new Date(),
                updatedAt: new Date(),
                emailVerified: true,
                image: "/avatars/seto.png"
              }
            },
            isPending: false,
            isRefetching: false,
            error: null,
            refetch: async () => {}
          }
        }
      }}
      navigate={() => {}}
      replace={() => {}}
      Link={({ href, ...props }) => <a {...props} />}
    >
      {children}
    </AuthProvider>
  )
}
