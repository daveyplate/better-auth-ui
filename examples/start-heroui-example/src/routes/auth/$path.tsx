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
 * Render centered authentication UI for the active auth subpath.
 *
 * @returns The JSX element containing a centered `Auth` component for the active route `path`.
 */
function AuthPage() {
  const { path } = Route.useParams()

  return (
    <div className="min-h-svh flex items-center justify-center p-4">
      <Auth path={path} />
    </div>
  )
}
