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
  email: string
  authClient: AuthClient
  localization?: Partial<ResendVerificationButtonLocalization>
}

export function ResendVerificationButton({
  email,
  authClient,
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

        const { error } = await authClient.sendVerificationEmail({
          email,
          callbackURL: "/dashboard"
        })

        toast.dismiss()

        if (error) {
          toast.error(error.message || error.status)
        } else {
          toast.success(localization.VERIFICATION_EMAIL_SENT)
        }

        setIsResending(false)
      }}
    >
      {isResending && <Spinner color="current" size="sm" />}

      {localization.RESEND}
    </Button>
  )
}

ResendVerificationButton.localization = localization
