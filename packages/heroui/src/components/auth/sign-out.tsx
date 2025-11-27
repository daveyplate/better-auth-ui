import { cn, useAuth } from "@better-auth-ui/react"
import { Card, Spinner } from "@heroui/react"
import { useEffect, useRef } from "react"
import { toast } from "sonner"

/**
 * Signs the current user out when mounted and displays a loading card while the operation completes.
 *
 * Attempts to sign out once, shows an error toast if sign-out fails, refetches session state, and navigates to the sign-in route.
 *
 * @param className - Optional class names to apply to the outer Card container
 * @returns A Card containing a centered Spinner shown while sign-out is in progress
 */
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
        toast.error(error.message)
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