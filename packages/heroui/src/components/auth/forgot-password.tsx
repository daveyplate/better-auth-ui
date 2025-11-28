"use client"

import { type AuthConfig, cn, useAuth } from "@better-auth-ui/react"
import {
  Button,
  Card,
  Description,
  FieldError,
  Fieldset,
  Form,
  Input,
  Label,
  Spinner,
  TextField
} from "@heroui/react"
import type { DeepPartial } from "better-auth/client/plugins"
import { type FormEvent, useState } from "react"
import { toast } from "sonner"

const forgotPasswordLocalization = {
  EMAIL: "Email",
  EMAIL_PLACEHOLDER: "Enter your email",
  FORGOT_PASSWORD: "Forgot Password",
  PASSWORD_RESET_EMAIL_SENT: "Password reset email sent",
  REMEMBER_YOUR_PASSWORD: "Remember your password?",
  SEND_RESET_LINK: "Send Reset Link",
  SIGN_IN: "Sign In"
}

export type ForgotPasswordLocalization = typeof forgotPasswordLocalization

export type ForgotPasswordProps = DeepPartial<AuthConfig> & {
  className?: string
  localization?: Partial<ForgotPasswordLocalization>
}

/**
 * Renders a "Forgot Password" form with an email input and submit button.
 *
 * Supports overriding displayed text via `props.localization` and accepts an optional `className` to modify container styling.
 *
 * @returns The rendered Forgot Password form UI as a JSX element
 */
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

    const form = e.currentTarget
    const formData = new FormData(form)
    const email = formData.get("email") as string

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: `${basePaths.auth}/${viewPaths.auth.resetPassword}`
    })

    setIsPending(false)

    if (error) {
      toast.error(error.message)
      form.reset()
      return
    }

    toast.success(localization.PASSWORD_RESET_EMAIL_SENT)
    navigate(`${basePaths.auth}/${viewPaths.auth.signIn}`)
  }

  return (
    <Card className={cn("w-full max-w-sm p-4 md:p-6", className)}>
      <Card.Content>
        <Form onSubmit={onSubmit}>
          <Fieldset className="gap-4">
            <Fieldset.Legend className="text-xl">
              {localization.FORGOT_PASSWORD}
            </Fieldset.Legend>

            <Description />

            <TextField
              name="email"
              type="email"
              autoComplete="email"
              isDisabled={isPending}
            >
              <Label>{localization.EMAIL}</Label>

              <Input
                className="text-base md:text-sm"
                placeholder={localization.EMAIL_PLACEHOLDER}
                required
              />

              <FieldError className="text-wrap" />
            </TextField>

            <Fieldset.Actions>
              <Button type="submit" className="w-full" isPending={isPending}>
                {isPending && <Spinner color="current" size="sm" />}

                {localization.SEND_RESET_LINK}
              </Button>
            </Fieldset.Actions>

            <Description className="flex justify-center gap-1 text-foreground text-sm">
              {localization.REMEMBER_YOUR_PASSWORD}

              <Link
                href={`${basePaths.auth}/${viewPaths.auth.signIn}`}
                className="link link--underline-hover text-accent"
              >
                {localization.SIGN_IN}
              </Link>
            </Description>
          </Fieldset>
        </Form>
      </Card.Content>
    </Card>
  )
}

ForgotPassword.localization = forgotPasswordLocalization
