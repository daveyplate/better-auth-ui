import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/")({ component: App })

/**
 * Root UI component that displays a centered "Hello World" heading and a Sign In link.
 *
 * @returns The JSX element containing a vertically centered column with the heading and a sign-in link.
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