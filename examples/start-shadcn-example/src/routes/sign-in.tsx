import { SignIn } from "@better-auth-ui/shadcn"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/sign-in")({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div className="min-h-svh flex items-center justify-center p-4">
      <SignIn socialProviders={["google", "apple"]} />
    </div>
  )
}
