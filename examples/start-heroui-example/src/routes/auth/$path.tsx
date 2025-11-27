import { Auth, authPaths } from "@better-auth-ui/heroui"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/auth/$path")({
  beforeLoad({ params: { path } }) {
    if (!authPaths.includes(path)) {
      throw redirect({ to: "/" })
    }
  },
  component: AuthPage
})

/**
 * Renders a centered authentication UI for the current auth subpath.
 *
 * @returns A React element that centers and renders the `Auth` component for the current route path.
 */
function AuthPage() {
  const { path } = Route.useParams()

  return (
    <div className="min-h-svh flex items-center justify-center p-4">
      <Auth path={path} />
    </div>
  )
}