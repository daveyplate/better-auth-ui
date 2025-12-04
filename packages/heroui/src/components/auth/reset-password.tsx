import { type AnyAuthConfig, useResetPassword } from "@better-auth-ui/react"
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
import { useEffect } from "react"
import { toast } from "sonner"

import { useAuth } from "../../hooks/use-auth"
import { cn } from "../../lib/utils"

export type ResetPasswordProps = AnyAuthConfig & {
  className?: string
}

/**
 * Renders a password reset form that validates a token from the URL and submits a new password to the auth client.
 */
export function ResetPassword({ className, ...config }: ResetPasswordProps) {
  const context = useAuth(config)

  const {
    basePaths,
    emailAndPassword,
    localization,
    viewPaths,
    navigate,
    Link
  } = context

  const [{ password }, resetPassword, isPending] = useResetPassword(context)

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const tokenParam = searchParams.get("token")

    if (!tokenParam) {
      toast.error(localization.auth.invalidResetPasswordToken)
      navigate(`${basePaths.auth}/${viewPaths.auth.signIn}`)
    }
  }, [
    basePaths.auth,
    localization.auth.invalidResetPasswordToken,
    viewPaths.auth.signIn,
    navigate
  ])

  return (
    <Card className={cn("w-full max-w-sm p-4 md:p-6", className)}>
      <Card.Content>
        <Form action={resetPassword}>
          <Fieldset className="gap-4">
            <Fieldset.Legend className="text-xl">
              {localization.auth.resetPassword}
            </Fieldset.Legend>

            <Description />

            <TextField
              defaultValue={password}
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
