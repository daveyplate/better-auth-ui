import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/")({ component: App })

/**
 * Root UI component that renders a centered "Hello World" heading and a Sign In link.
 *
 * @returns The component's JSX: a vertically centered column containing the heading and a link to "/auth/$path" with params `{ path: "sign-in" }`
 */
function App() {
  return (
    <div className="min-h-svh flex items-center justify-center flex-col gap-4">
      <h1 className="text-4xl font-bold">Hello World</h1>
      <Link
        to="/auth/$path"
        params={{ path: "sign-in" }}
        className="text-blue-600 hover:text-blue-800 underline"
      >
        Sign In
      </Link>
    </div>
  )
}