import Link from "next/link"

/**
 * Renders the home page with a centered "Hello World" heading and a sign-in link.
 *
 * @returns The page's JSX element containing a vertically centered layout with an H1 displaying "Hello World" and a Next.js `Link` to `/auth/sign-in`.
 */
export default function Home() {
  return (
    <div className="min-h-svh flex items-center justify-center flex-col gap-4">
      <h1 className="text-4xl font-bold">Hello World</h1>
      <Link
        href="/auth/sign-in"
        className="text-blue-600 hover:text-blue-800 underline"
      >
        Sign In
      </Link>
    </div>
  )
}