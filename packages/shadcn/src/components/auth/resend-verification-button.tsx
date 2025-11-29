"use client"

import type { AuthClient } from "@better-auth-ui/react"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

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
 * Renders a small button that initiates sending a verification email to the given address.
 *
 * @param baseURL - Optional base URL prepended to `redirectTo` to form the verification callback URL
 * @param email - Recipient email address for the verification message
 * @param redirectTo - Path appended to `baseURL` to form the verification callback URL
 * @returns A Button element that initiates resending a verification email and reflects the request state
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
      disabled={isResending}
      onClick={async () => {
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
      {isResending && <Spinner />}

      {localization.RESEND}
    </Button>
  )
}

ResendVerificationButton.localization = resendVerificationButtonLocalization
