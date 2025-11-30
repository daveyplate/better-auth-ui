import type { AnyAuthConfig } from "@better-auth-ui/react"
import { useActionState } from "react"

import { useAuth } from "./use-auth"

export const useSignInLocalization = {
  RESEND: "Resend",
  VERIFICATION_EMAIL_SENT: "Verification email sent!"
}

export type UseSignInLocalization = typeof useSignInLocalization

export function useSignIn(config?: AnyAuthConfig<UseSignInLocalization>) {
  const context = useAuth(config)

  const { authClient, baseURL, emailAndPassword, redirectTo, toast, navigate } =
    context

  const localization = { ...useSignInLocalization, ...context.localization }

  const { refetch } = authClient.useSession()

  const signInAction = async (_: object, formData: FormData) => {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const rememberMe = formData.get("rememberMe") === "on"

    const { error } = await authClient.signIn.email(
      {
        email,
        password,
        ...(emailAndPassword?.rememberMe ? { rememberMe } : {})
      },
      { disableSignal: true }
    )

    if (error) {
      if (error.code === "EMAIL_NOT_VERIFIED") {
        const toastId = toast.error(error.message, {
          action: {
            label: localization.RESEND,
            onClick: async () => {
              const callbackURL = `${baseURL ?? ""}${redirectTo}`

              toast.dismiss?.(toastId)

              const { error } = await authClient.sendVerificationEmail({
                email,
                callbackURL
              })

              if (error) {
                toast.error(error.message)
              } else {
                toast.success(localization.VERIFICATION_EMAIL_SENT)
              }
            }
          }
        })
      } else {
        toast.error(error.message)
      }

      return {
        email,
        password: ""
      }
    }

    await refetch()
    navigate(redirectTo)

    return { email, password }
  }

  return useActionState(signInAction, {
    email: "",
    password: ""
  })
}
