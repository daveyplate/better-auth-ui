import { Auth } from "@better-auth-ui/heroui"
import { authPaths } from "@better-auth-ui/heroui/server"
import { notFound } from "next/navigation"

/**
 * Renders the authentication UI for a validated route path.
 *
 * If the resolved `path` is not included in `authPaths`, this page triggers a 404 response via `notFound()`.
 *
 * @param params - A promise that resolves to route parameters with a `path` string used to select the auth UI
 * @returns A centered JSX element containing the `Auth` component configured for the resolved `path`
 */
export default async function AuthPage({
  params
}: {
  params: Promise<{
    path: string
  }>
}) {
  const { path } = await params

  if (!authPaths.includes(path)) {
    notFound()
  }

  return (
    <div className="min-h-svh flex items-center justify-center p-4">
      <Auth path={path} />
    </div>
  )
}
