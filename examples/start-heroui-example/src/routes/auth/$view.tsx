import { Auth } from "@better-auth-ui/heroui"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/auth/$view")({
  component: AuthView
})

function AuthView() {
  const { view } = Route.useParams()

  return (
    <div className="min-h-svh flex items-center justify-center p-4">
      <Auth view={view} />
    </div>
  )
}
