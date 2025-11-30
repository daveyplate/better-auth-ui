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

import { FieldSeparator } from "./field-separator"
import { MagicLinkButton } from "./magic-link-button"
import { ProviderButtons, type SocialLayout } from "./provider-buttons"

export type SignUpProps = AnyAuthConfig & {
  className?: string
  socialLayout?: SocialLayout
}

/**
 * Renders a sign-up form with name, email, and password fields, optional social provider buttons, and submission handling.
 *
 * Submits credentials to the configured auth client and handles the response:
 * - If email verification is required, shows a notification and navigates to sign-in
 * - On success, refreshes the session and navigates to the configured redirect path
 * - On failure, displays error toasts
 * - Manages a pending state while the request is in-flight
 *
 * @param props - Configuration and appearance overrides (e.g., `className`, `localization`, `socialLayout`) plus auth-related options passed through to the auth hook.
 * @returns The sign-up form React element.
 */
export function SignUp({ className, socialLayout, ...props }: SignUpProps) {
  const {
    authClient,
    basePaths,
    emailAndPassword,
    localization,
    magicLink,
    redirectTo,
    socialProviders,
    viewPaths,
    navigate,
    Link
  } = useAuth(props)

  const { refetch } = authClient.useSession()

  const [isPending, setIsPending] = useState(false)
  const [password, setPassword] = useState("")

  const showSeparator =
    emailAndPassword?.enabled && socialProviders && socialProviders.length > 0

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)

    const formData = new FormData(e.currentTarget)

    const name = formData.get("name") as string
    const email = formData.get("email") as string

    const { error } = await authClient.signUp.email(
      {
        name,
        email,
        password
      },
      { disableSignal: true }
    )

    setIsPending(false)

    if (error) {
      toast.error(error.message)
      setPassword("")
      return
    }

    if (emailAndPassword?.requireEmailVerification) {
      toast.success(localization.auth.verifyYourEmail)
      navigate(`${basePaths.auth}/${viewPaths.auth.signIn}`)
      return
    }

    await refetch()
    navigate(redirectTo)
  }

  return (
    <Card className={cn("w-full max-w-sm p-4 md:p-6", className)}>
      <Card.Content>
        <Form onSubmit={onSubmit}>
          <Fieldset className="gap-4">
            <Fieldset.Legend className="text-xl">
              {localization.auth.signUp}
            </Fieldset.Legend>

            <Description />

            <Fieldset.Group>
              <TextField
                name="name"
                type="text"
                autoComplete="name"
                isDisabled={isPending}
              >
                <Label>{localization.auth.name}</Label>

                <Input
                  className="text-base md:text-sm"
                  placeholder={localization.auth.namePlaceholder}
                  required
                />

                <FieldError className="text-wrap" />
              </TextField>

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

              <TextField
                minLength={8}
                name="password"
                type="password"
                autoComplete="new-password"
                isDisabled={isPending}
                value={password}
                onChange={setPassword}
              >
                <Label>{localization.auth.password}</Label>

                <Input
                  className="text-base md:text-sm"
                  placeholder={localization.auth.passwordPlaceholder}
                  required
                />

                <FieldError className="text-wrap" />
              </TextField>
            </Fieldset.Group>

            <Fieldset.Actions className="flex-col gap-3">
              <Button type="submit" className="w-full" isPending={isPending}>
                {isPending && <Spinner color="current" size="sm" />}

                {localization.auth.signUp}
              </Button>

              {magicLink && (
                <MagicLinkButton
                  view="signUp"
                  isPending={isPending}
                  {...props}
                />
              )}
            </Fieldset.Actions>

            {showSeparator && (
              <FieldSeparator>{localization.auth.or}</FieldSeparator>
            )}

            {socialProviders && socialProviders.length > 0 && (
              <ProviderButtons
                {...props}
                isPending={isPending}
                setIsPending={setIsPending}
                localization={localization}
                socialLayout={socialLayout}
              />
            )}

            {emailAndPassword?.enabled && (
              <Description className="flex justify-center gap-1.5 text-foreground text-sm">
                {localization.auth.alreadyHaveAnAccount}

                <Link
                  href={`${basePaths.auth}/${viewPaths.auth.signIn}`}
                  className="link link--underline-hover text-accent"
                >
                  {localization.auth.signIn}
                </Link>
              </Description>
            )}
          </Fieldset>
        </Form>
      </Card.Content>
    </Card>
  )
}
