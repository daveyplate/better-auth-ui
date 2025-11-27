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
  EMAIL_PLACEHOLDER: "Enter your email",
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

  const { authClient, basePaths, viewPaths, navigate, Link } = useAuth(props)
  const [isPending, setIsPending] = useState(false)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: `${basePaths.auth}/${viewPaths.auth.resetPassword}`
    })

    if (error) {
      toast.error(error.message)
      setIsPending(false)
      e.currentTarget.reset()
      return
    }

    toast.success(localization.PASSWORD_RESET_EMAIL_SENT)
    navigate(`${basePaths.auth}/${viewPaths.auth.signIn}`)
  }

  return (
    <Card className={cn("w-full max-w-sm md:p-6 gap-6", className)}>
      <Card.Header className="text-xl font-medium">
        {localization.FORGOT_PASSWORD}
      </Card.Header>

      <Card.Content>
        <Form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <TextField
            name="email"
            type="email"
            autoComplete="email"
            isDisabled={isPending}
          >
            <Label>{localization.EMAIL}</Label>

            <Input placeholder={localization.EMAIL_PLACEHOLDER} required />

            <FieldError />
          </TextField>

          <Button type="submit" className="w-full" isPending={isPending}>
            {isPending && <Spinner color="current" size="sm" />}

            {localization.SEND_RESET_LINK}
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

ForgotPassword.localization = localization
