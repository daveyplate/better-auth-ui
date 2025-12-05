import { createFileRoute, Link } from "@tanstack/react-router"
import { HomeLayout } from "fumadocs-ui/layouts/home"
import { baseOptions } from "@/lib/layout.shared"

export const Route = createFileRoute("/")({
  component: Home
})

function Home() {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="flex flex-col items-center justify-center min-h-[calc(100svh-4rem)] text-center">
        <h1 className="font-medium text-xl mb-4">
          Fumadocs on Tanstack Start.
        </h1>
        <Link
          to="/docs/$"
          params={{
            _splat: ""
          }}
          className="px-3 py-2 rounded-lg bg-fd-primary text-fd-primary-foreground font-medium text-sm"
        >
          Open Docs
        </Link>
      </div>
    </HomeLayout>
  )
}
