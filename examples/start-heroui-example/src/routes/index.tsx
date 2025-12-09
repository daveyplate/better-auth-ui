import { UserAvatar } from "@better-auth-ui/heroui"
import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="min-h-svh flex items-center justify-center flex-col gap-4">
      <Link
        to="/auth/$path"
        params={{ path: "sign-in" }}
        className="text-blue-600 hover:text-blue-800 underline"
      >
        Sign In
      </Link>

      <UserAvatar />
    </div>
  )
}
