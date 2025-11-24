import { Auth, type AuthView } from "@better-auth-ui/heroui"

interface AuthPageProps {
  params: Promise<{
    view: string
  }>
}

export default async function AuthPage({ params }: AuthPageProps) {
  const { view } = await params

  return (
    <div className="min-h-svh flex items-center justify-center p-4">
      <Auth view={view as AuthView} />
    </div>
  )
}
