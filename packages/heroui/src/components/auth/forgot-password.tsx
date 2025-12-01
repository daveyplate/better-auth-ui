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
import { type FormEvent, useState } from "react"
import { toast } from "sonner"

import { useAuth } from "../../hooks/use-auth"
import { cn } from "../../lib/utils"

export type ForgotPasswordProps = AnyAuthConfig & {
  className?: string
}

/**
 * Renders a "Forgot Password" form with an email input and submit button.
 *
 * Supports overriding displayed text via `props.localization` and accepts an optional `className` to modify container styling.
 *
 * @returns The rendered Forgot Password form UI as a JSX element
 */
export function ForgotPassword({ className, ...props }: ForgotPasswordProps) {
  const { authClient, basePaths, localization, viewPaths, navigate, Link } =
    useAuth(props)

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
      toast.error(error.message || error.statusText)
      form.reset()
      return
    }

    toast.success(localization.auth.passwordResetEmailSent)
    navigate(`${basePaths.auth}/${viewPaths.auth.signIn}`)
  }

  return (
    <Card className={cn("w-full max-w-sm p-4 md:p-6", className)}>
      <Card.Content>
        <Form onSubmit={onSubmit}>
          <Fieldset className="gap-4">
            <Fieldset.Legend className="text-xl">
              {localization.auth.forgotPassword}
            </Fieldset.Legend>

            <Description />

            <TextField
              name="email"
              type="email"
              autoComplete="email"
              isDisabled={isPending}
            >
              <Label>{localization.auth.email}</Label>

              <Input
                className="text-base md:text-sm"
                placeholder={localization.auth.emailPlaceholder}
                required
              />

              <FieldError className="text-wrap" />
            </TextField>

            <Fieldset.Actions>
              <Button type="submit" className="w-full" isPending={isPending}>
                {isPending && <Spinner color="current" size="sm" />}

                {localization.auth.sendResetLink}
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
