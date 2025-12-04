import type { AnyAuthConfig } from "@better-auth-ui/react"
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
import { type FormEvent, useEffect, useState } from "react"
import { toast } from "sonner"

import { useAuth } from "../../hooks/use-auth"
import { cn } from "../../lib/utils"

export type ResetPasswordProps = AnyAuthConfig & {
  className?: string
}

/**
 * Renders a password reset form that validates a token from the URL and submits a new password to the auth client.
 */
export function ResetPassword({ className, ...props }: ResetPasswordProps) {
  const {
    authClient,
    basePaths,
    emailAndPassword,
    localization,
    viewPaths,
    navigate,
    Link
  } = useAuth(props)

  const [isPending, setIsPending] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const tokenParam = searchParams.get("token")

    if (!tokenParam) {
      toast.error(localization.auth.invalidResetPasswordToken)
      navigate(`${basePaths.auth}/${viewPaths.auth.signIn}`)
      return
    }

    setToken(tokenParam)
  }, [
    basePaths.auth,
    localization.auth.invalidResetPasswordToken,
    viewPaths.auth.signIn,
    navigate
  ])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!token) {
      toast.error(localization.auth.invalidResetPasswordToken)
      return
    }

    setIsPending(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    const password = formData.get("password") as string

    const { error } = await authClient.resetPassword({
      token,
      newPassword: password
    })

    setIsPending(false)

    if (error) {
      toast.error(error.message || error.statusText)
      form.reset()
      return
    }

    toast.success(localization.auth.passwordResetSuccess)
    navigate(`${basePaths.auth}/${viewPaths.auth.signIn}`)
  }

  return (
    <Card className={cn("w-full max-w-sm p-4 md:p-6", className)}>
      <Card.Content>
        <Form onSubmit={onSubmit}>
          <Fieldset className="gap-4">
            <Fieldset.Legend className="text-xl">
              {localization.auth.resetPassword}
            </Fieldset.Legend>

            <Description />

            <TextField
              minLength={emailAndPassword?.minPasswordLength}
              maxLength={emailAndPassword?.maxPasswordLength}
              validate={emailAndPassword?.validatePassword}
              name="password"
              type="password"
              autoComplete="new-password"
              isDisabled={isPending}
            >
              <Label>{localization.auth.password}</Label>

              <Input
                className="text-base md:text-sm"
                placeholder={localization.auth.newPasswordPlaceholder}
                required
              />

              <FieldError className="text-wrap" />
            </TextField>

            <Fieldset.Actions>
              <Button type="submit" className="w-full" isPending={isPending}>
                {isPending && <Spinner color="current" size="sm" />}

                {localization.auth.resetPassword}
              </Button>
            </Fieldset.Actions>

            <Description className="flex justify-center gap-1.5 text-foreground text-sm">
              {localization.auth.rememberYourPassword}

              <Link
                href={`${basePaths.auth}/${viewPaths.auth.signIn}`}
                className="link link--underline-hover text-accent"
              >
                {localization.auth.signIn}
              </Link>
            </Description>
          </Fieldset>
        </Form>
      </Card.Content>
    </Card>
  )
}
