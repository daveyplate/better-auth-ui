import { Auth } from "@better-auth-ui/heroui"
import { authPaths } from "@better-auth-ui/heroui/server"
import { notFound } from "next/navigation"

/**
 * Render the authentication UI for a given route path.
 *
 * If the provided `path` is not present in `authPaths`, this component triggers a 404 response via `notFound()`.
 *
 * @param params - A promise that resolves to route parameters containing the `path` string used to select the auth UI.
 * @returns A JSX element that centers and renders the `Auth` component configured for the resolved `path`.
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
