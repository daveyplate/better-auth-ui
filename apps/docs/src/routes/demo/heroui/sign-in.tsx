import { SignIn } from "@better-auth-ui/heroui"
import { createFileRoute } from "@tanstack/react-router"
import { DemoProvider } from "@/components/demos/provider"

import herouiCss from "@/styles/heroui.css?url"

export const Route = createFileRoute("/demo/heroui/sign-in")({
  component: RouteComponent,
  head: () => ({
    links: [{ rel: "stylesheet", href: herouiCss }]
  })
})

function RouteComponent() {
  return (
    <DemoProvider>
      <div className="flex flex-col p-4 md:p-6 justify-center items-center min-h-svh">
        <SignIn />
      </div>
    </DemoProvider>
  )
}
