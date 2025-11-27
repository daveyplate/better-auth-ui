"use client"

import type { AuthClient } from "@better-auth-ui/react"
import { Button, Spinner } from "@heroui/react"
import { useState } from "react"
import { toast } from "sonner"

const resendVerificationButtonLocalization = {
  RESEND: "Resend",
  VERIFICATION_EMAIL_SENT: "Verification email sent!"
}

export type ResendVerificationButtonLocalization =
  typeof resendVerificationButtonLocalization

export type ResendVerificationButtonProps = {
  authClient: AuthClient
  baseURL?: string
  email: string
  localization?: Partial<ResendVerificationButtonLocalization>
  redirectTo: string
}

/**
 * Renders a small button that resends a verification email to the provided address.
 *
 * @param authClient - Auth client used to send the verification email
 * @param baseURL - Base URL used to build the verification callback URL
 * @param email - Recipient email address for the verification message
 * @param redirectTo - Path appended to `baseURL` to form the verification callback URL
 * @returns The button element which shows a spinner while the request is in progress
 */
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

        toast.dismiss()
        setIsResending(false)

        if (error) {
          toast.error(error.message)
        } else {
          toast.success(localization.VERIFICATION_EMAIL_SENT)
        }
      }}
    >
      {isResending && <Spinner color="current" size="sm" />}

      {localization.RESEND}
    </Button>
  )
}

ResendVerificationButton.localization = resendVerificationButtonLocalization
