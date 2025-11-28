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

import { FieldSeparator } from "./field-separator"
import { MagicLinkButton } from "./magic-link-button"
import { ProviderButtons, type SocialLayout } from "./provider-buttons"

const signUpLocalization = {
  ...MagicLinkButton.localization,
  ...ProviderButtons.localization,
  ALREADY_HAVE_AN_ACCOUNT: "Already have an account?",
  EMAIL: "Email",
  EMAIL_PLACEHOLDER: "Enter your email",
  ENTER_YOUR_NAME: "Enter your name",
  NAME: "Name",
  OR: "OR",
  PASSWORD: "Password",
  PASSWORD_PLACEHOLDER: "Enter your password",
  SIGN_IN: "Sign In",
  SIGN_UP: "Sign Up",
  VERIFY_YOUR_EMAIL: "Please verify your email before signing in"
}

export type SignUpLocalization = typeof signUpLocalization

export type SignUpProps = DeepPartial<AuthConfig> & {
  className?: string
  localization?: Partial<SignUpLocalization>
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
export function SignUp({ className, ...props }: SignUpProps) {
  const localization = { ...SignUp.localization, ...props.localization }

  const {
    authClient,
    basePaths,
    emailAndPassword,
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
      toast.success(localization.VERIFY_YOUR_EMAIL)
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
              {localization.SIGN_UP}
            </Fieldset.Legend>

            <Description />

            <Fieldset.Group>
              <TextField
                name="name"
                type="text"
                autoComplete="name"
                isDisabled={isPending}
              >
                <Label>{localization.NAME}</Label>

                <Input placeholder={localization.ENTER_YOUR_NAME} required />

                <FieldError className="text-wrap" />
              </TextField>

              <TextField
                name="email"
                type="email"
                autoComplete="email"
                isDisabled={isPending}
              >
                <Label>{localization.EMAIL}</Label>

                <Input placeholder={localization.EMAIL_PLACEHOLDER} required />

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
                <Label>{localization.PASSWORD}</Label>

                <Input
                  placeholder={localization.PASSWORD_PLACEHOLDER}
                  required
                />

                <FieldError className="text-wrap" />
              </TextField>
            </Fieldset.Group>

            <Fieldset.Actions className="flex-col gap-3">
              <Button type="submit" className="w-full" isPending={isPending}>
                {isPending && <Spinner color="current" size="sm" />}

                {localization.SIGN_UP}
              </Button>

              {magicLink && (
                <MagicLinkButton
                  view="signUp"
                  isPending={isPending}
                  localization={localization}
                />
              )}
            </Fieldset.Actions>

            {showSeparator && (
              <FieldSeparator>{localization.OR}</FieldSeparator>
            )}

            {socialProviders && socialProviders.length > 0 && (
              <ProviderButtons
                {...props}
                isPending={isPending}
                setIsPending={setIsPending}
                localization={localization}
              />
            )}

            {emailAndPassword?.enabled && (
              <Description className="text-center text-foreground text-sm">
                {localization.ALREADY_HAVE_AN_ACCOUNT}{" "}
                <Link
                  href={`${basePaths.auth}/${viewPaths.auth.signIn}`}
                  className="link link--underline-hover text-accent"
                >
                  {localization.SIGN_IN}
                </Link>
              </Description>
            )}
          </Fieldset>
        </Form>
      </Card.Content>
    </Card>
  )
}

SignUp.localization = signUpLocalization
