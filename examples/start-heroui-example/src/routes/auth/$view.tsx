import { Auth, type AuthView, authViews } from "@better-auth-ui/heroui"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/auth/$view")({
  beforeLoad({ params: { view } }) {
    if (!authViews.includes(view as AuthView)) {
      throw redirect({ to: "/" })
    }
  },
  component: AuthPage
})

function AuthPage() {
  const { view } = Route.useParams()

  return (
    <div className="min-h-svh flex items-center justify-center p-4">
      <Auth view={view} />
    </div>
  )
}
