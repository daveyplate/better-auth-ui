"use client"

import { type AuthConfig, cn, useAuth } from "@better-auth-ui/react"
import {
  Button,
  Card,
  FieldError,
  Form,
  Input,
  Label,
  Spinner,
  TextField
} from "@heroui/react"
import type { DeepPartial } from "better-auth/client/plugins"
import { type FormEvent, useEffect, useState } from "react"
import { toast } from "sonner"

const resetPasswordLocalization = {
  INVALID_RESET_PASSWORD_TOKEN: "Invalid reset password token",
  NEW_PASSWORD_PLACEHOLDER: "Enter your new password",
  PASSWORD: "Password",
  PASSWORD_RESET_SUCCESS: "Password reset successfully",
  REMEMBER_YOUR_PASSWORD: "Remember your password?",
  RESET_PASSWORD: "Reset Password",
  SIGN_IN: "Sign In"
}

export type ResetPasswordLocalization = typeof resetPasswordLocalization

export type ResetPasswordProps = DeepPartial<AuthConfig> & {
  className?: string
  localization?: Partial<ResetPasswordLocalization>
}

/**
 * Render a password reset form that validates a token from the URL and submits a new password to the auth client.
 *
 * @param props - Component props; may include `className` for container styling and `localization` to override displayed strings.
 * @returns The rendered ResetPassword form element.
 */
export function ResetPassword({ className, ...props }: ResetPasswordProps) {
  const localization = {
    ...ResetPassword.localization,
    ...props.localization
  }

  const { authClient, basePaths, viewPaths, navigate, Link } = useAuth(props)

  const [isPending, setIsPending] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const tokenParam = searchParams.get("token")

    if (!tokenParam) {
      toast.error(localization.INVALID_RESET_PASSWORD_TOKEN)
      navigate(`${basePaths.auth}/${viewPaths.auth.signIn}`)
      return
    }

    setToken(tokenParam)
  }, [
    basePaths.auth,
    localization.INVALID_RESET_PASSWORD_TOKEN,
    viewPaths.auth.signIn,
    navigate
  ])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)

    if (!token) {
      toast.error(localization.INVALID_RESET_PASSWORD_TOKEN)
      setIsPending(false)
      return
    }

    const formData = new FormData(e.currentTarget)
    const password = formData.get("password") as string

    const { error } = await authClient.resetPassword({
      token,
      newPassword: password
    })

    if (error) {
      toast.error(error.message)
      setIsPending(false)

      return
    }

    toast.success(localization.PASSWORD_RESET_SUCCESS)
    navigate(`${basePaths.auth}/${viewPaths.auth.signIn}`)

    setIsPending(false)
  }

  return (
    <Card className={cn("w-full max-w-sm md:p-6 gap-6", className)}>
      <Card.Header className="text-xl font-medium">
        {localization.RESET_PASSWORD}
      </Card.Header>

      <Card.Content>
        <Form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <TextField
            minLength={8}
            name="password"
            type="password"
            autoComplete="new-password"
            isDisabled={isPending}
          >
            <Label>{localization.PASSWORD}</Label>

            <Input
              placeholder={localization.NEW_PASSWORD_PLACEHOLDER}
              required
            />

            <FieldError />
          </TextField>

          <Button type="submit" className="w-full" isPending={isPending}>
            {isPending && <Spinner color="current" size="sm" />}

            {localization.RESET_PASSWORD}
          </Button>

          <p className="text-sm justify-center flex gap-2 items-center">
            {localization.REMEMBER_YOUR_PASSWORD}

            <Link
              href={`${basePaths.auth}/${viewPaths.auth.signIn}`}
              className="link link--underline-always text-accent"
            >
              {localization.SIGN_IN}
            </Link>
          </p>
        </Form>
      </Card.Content>
    </Card>
  )
}

ResetPassword.localization = resetPasswordLocalization
