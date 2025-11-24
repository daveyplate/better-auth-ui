import { Auth, type AuthView } from "@better-auth-ui/heroui"
import { authViews } from "@better-auth-ui/heroui/server"
import { notFound } from "next/navigation"

interface AuthPageProps {
  params: Promise<{
    view: string
  }>
}

export default async function AuthPage({ params }: AuthPageProps) {
  const { view } = await params

  if (!authViews.includes(view as AuthView)) {
    notFound()
  }

  return (
    <div className="min-h-svh flex items-center justify-center p-4">
      <Auth view={view as AuthView} />
    </div>
  )
}
