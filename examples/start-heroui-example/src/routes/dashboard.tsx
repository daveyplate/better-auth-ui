import { useAuthenticate } from "@better-auth-ui/heroui"
import { Button, Spinner } from "@heroui/react"
import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard")({
  component: Dashboard
})

function Dashboard() {
  const { data: session } = useAuthenticate()

  if (!session) {
    return (
      <div className="min-h-svh flex items-center justify-center">
        <Spinner color="current" />
      </div>
    )
  }

  return (
    <div className="min-h-svh flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl">Hello, {session.user.email}</h1>

      <Button as={Link} to="/auth/$path" params={{ path: "sign-out" }}>
        Sign Out
      </Button>
    </div>
  )
}
