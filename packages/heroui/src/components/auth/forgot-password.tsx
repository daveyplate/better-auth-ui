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
import { type FormEvent, useState } from "react"
import { toast } from "sonner"

const localization = {
  EMAIL: "Email",
  ENTER_YOUR_EMAIL: "Enter your email",
  FORGOT_PASSWORD: "Forgot Password",
  PASSWORD_RESET_EMAIL_SENT: "Password reset email sent",
  REMEMBER_YOUR_PASSWORD: "Remember your password?",
  SEND_RESET_LINK: "Send Reset Link",
  SIGN_IN: "Sign In"
}

export type ForgotPasswordLocalization = typeof localization

export type ForgotPasswordProps = DeepPartial<AuthConfig> & {
  className?: string
  localization?: Partial<ForgotPasswordLocalization>
}

export function ForgotPassword({ className, ...props }: ForgotPasswordProps) {
  const localization = {
    ...ForgotPassword.localization,
    ...props.localization
  }

  const { authClient, navigate, Link, basePaths } = useAuth(props)
  const [isPending, setIsPending] = useState(false)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: `${basePaths.auth}/reset-password`
    })

    if (error) {
      toast.error(error.message || error.status)
      setIsPending(false)

      return
    }

    toast.success(localization.PASSWORD_RESET_EMAIL_SENT)
    navigate(`${basePaths.auth}/sign-in`)
  }

  return (
    <Card className={cn("w-full max-w-sm md:p-6 gap-6", className)}>
      <Card.Header className="text-xl font-medium">
        {localization.FORGOT_PASSWORD}
      </Card.Header>

      <Card.Content>
        <Form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <div className="flex flex-col gap-4">
            <TextField name="email" type="email" autoComplete="email">
              <Label>{localization.EMAIL}</Label>

              <Input
                placeholder={localization.ENTER_YOUR_EMAIL}
                required
                disabled={isPending}
              />

              <FieldError />
            </TextField>
          </div>

          <div className="flex flex-col gap-4">
            <Button type="submit" className="w-full" isPending={isPending}>
              {isPending && <Spinner color="current" size="sm" />}
              {localization.SEND_RESET_LINK}
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

ForgotPassword.localization = localization
