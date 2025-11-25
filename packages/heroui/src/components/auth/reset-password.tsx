"use client"

import {
  type AnyAuthClient,
  type AuthConfig,
  cn,
  useAuth
} from "@better-auth-ui/react"
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

const localization = {
  ENTER_NEW_PASSWORD: "Enter your new password",
  INVALID_RESET_PASSWORD_TOKEN: "Invalid reset password token",
  PASSWORD: "Password",
  RESET_PASSWORD: "Reset Password",
  PASSWORD_RESET_SUCCESS: "Password reset successfully",
  REMEMBER_YOUR_PASSWORD: "Remember your password?",
  SIGN_IN: "Sign In"
}

export type ResetPasswordLocalization = typeof localization

export type ResetPasswordProps<TAuthClient extends AnyAuthClient> = DeepPartial<
  AuthConfig<TAuthClient>
> & {
  className?: string
  localization?: Partial<ResetPasswordLocalization>
}

export function ResetPassword<TAuthClient extends AnyAuthClient>({
  className,
  ...props
}: ResetPasswordProps<TAuthClient>) {
  const localization = {
    ...ResetPassword.localization,
    ...props.localization
  }

  const { authClient, navigate, Link, basePaths } = useAuth(props)
  const [isPending, setIsPending] = useState(false)

  // Check for error or missing token on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const error = searchParams.get("error")
    const token = searchParams.get("token")

    if (error === "INVALID_TOKEN" || !token) {
      toast.error(localization.INVALID_RESET_PASSWORD_TOKEN)
      navigate(`${basePaths.auth}/sign-in`)
      return
    }
  }, [navigate, localization.INVALID_RESET_PASSWORD_TOKEN, basePaths.auth])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)

    const searchParams = new URLSearchParams(window.location.search)
    const token = searchParams.get("token")

    if (!token) {
      toast.error(localization.INVALID_RESET_PASSWORD_TOKEN)
      navigate(`${basePaths.auth}/sign-in`)
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
      toast.error(error.message || error.status)
      setIsPending(false)

      return
    }

    toast.success(localization.PASSWORD_RESET_SUCCESS)
    navigate(`${basePaths.auth}/sign-in`)
    setIsPending(false)
  }

  return (
    <Card className={cn("w-full max-w-sm md:p-6 gap-6", className)}>
      <Card.Header className="text-xl font-medium">
        {localization.RESET_PASSWORD}
      </Card.Header>

      <Card.Content>
        <Form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <div className="flex flex-col gap-4">
            <TextField
              minLength={8}
              name="password"
              type="password"
              autoComplete="new-password"
            >
              <Label>{localization.PASSWORD}</Label>

              <Input
                placeholder={localization.ENTER_NEW_PASSWORD}
                required
                disabled={isPending}
              />

              <FieldError />
            </TextField>
          </div>

          <div className="flex flex-col gap-4">
            <Button type="submit" className="w-full" isPending={isPending}>
              {isPending && <Spinner color="current" size="sm" />}

              {localization.RESET_PASSWORD}
            </Button>
          </div>

          <p className="text-sm justify-center flex gap-2 items-center mb-1">
            {localization.REMEMBER_YOUR_PASSWORD}

            <Link
              href={`${basePaths.auth}/sign-in`}
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

ResetPassword.localization = localization
