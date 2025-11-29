import { authPaths } from "@better-auth-ui/react"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { SignIn } from "@/components/auth/sign-in"

export const Route = createFileRoute("/auth/$path")({
  beforeLoad({ params: { path } }) {
    if (!authPaths.includes(path)) {
      throw redirect({ to: "/" })
    }
  },
  component: AuthPage
})

function AuthPage() {
  const { path } = Route.useParams()

  return (
    <div className="min-h-svh flex items-center justify-center p-4">
      <SignIn />
    </div>
  )
}
