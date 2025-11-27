"use client"

import type { AuthClient } from "@better-auth-ui/react"
import { Button, Spinner } from "@heroui/react"
import { useState } from "react"
import { toast } from "sonner"

const localization = {
  RESEND: "Resend",
  VERIFICATION_EMAIL_SENT: "Verification email sent!"
}

export type ResendVerificationButtonLocalization = typeof localization

export type ResendVerificationButtonProps = {
  authClient: AuthClient
  baseURL?: string
  email: string
  localization?: Partial<ResendVerificationButtonLocalization>
  redirectTo: string
}

export function ResendVerificationButton({
  authClient,
  baseURL,
  email,
  redirectTo,
  ...props
}: ResendVerificationButtonProps) {
  const localization = {
    ...ResendVerificationButton.localization,
    ...props.localization
  }

  const [isResending, setIsResending] = useState(false)

  return (
    <Button
      size="sm"
      isPending={isResending}
      onPress={async () => {
        setIsResending(true)

        const callbackURL = `${baseURL}${redirectTo}`

        const { error } = await authClient.sendVerificationEmail({
          email,
          callbackURL
        })

        if (error) {
          toast.error(error.message || error.statusText)
        } else {
          toast.success(localization.VERIFICATION_EMAIL_SENT)
        }

        toast.dismiss()
        setIsResending(false)
      }}
    >
      {isResending && <Spinner color="current" size="sm" />}

      {localization.RESEND}
    </Button>
  )
}

ResendVerificationButton.localization = localization
