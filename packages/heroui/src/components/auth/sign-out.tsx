import { cn, useAuth } from "@better-auth-ui/react"
import { Card, Spinner } from "@heroui/react"
import { useEffect, useRef } from "react"
import { toast } from "sonner"

export function SignOut({ className }: { className?: string }) {
  const { authClient, basePaths, viewPaths, navigate } = useAuth()
  const { refetch } = authClient.useSession()

  const hasSignedOut = useRef(false)

  useEffect(() => {
    if (hasSignedOut.current) return

    const handleSignOut = async () => {
      hasSignedOut.current = true

      const { error } = await authClient.signOut({
        fetchOptions: { disableSignal: true }
      })

      if (error) {
        toast.error(error.message || error.statusText)
      }

      await refetch()

      navigate(`${basePaths.auth}/${viewPaths.auth.signIn}`)
    }

    handleSignOut()
  }, [authClient, basePaths.auth, viewPaths.auth.signIn, navigate, refetch])

  return (
    <Card
      variant="transparent"
      className={cn("w-full max-w-sm md:p-6 gap-6", className)}
    >
      <Spinner className="mx-auto my-auto" color="current" />
    </Card>
  )
}
