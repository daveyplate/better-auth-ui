"use client"

import { type AuthConfig, cn, useAuth } from "@better-auth-ui/react"
import {
  Button,
  Card,
  Checkbox,
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
import { ResendVerificationButton } from "./resend-verification-button"

const signInLocalization = {
  ...MagicLinkButton.localization,
  ...ProviderButtons.localization,
  ...ResendVerificationButton.localization,
  EMAIL: "Email",
  EMAIL_PLACEHOLDER: "Enter your email",
  FORGOT_PASSWORD: "Forgot password?",
  PASSWORD: "Password",
  PASSWORD_PLACEHOLDER: "Enter your password",
  NEED_TO_CREATE_AN_ACCOUNT: "Need to create an account?",
  OR: "OR",
  REMEMBER_ME: "Remember me",
  SIGN_IN: "Sign In",
  SIGN_UP: "Sign Up"
}

export type SignInLocalization = typeof signInLocalization

export type SignInProps = DeepPartial<AuthConfig> & {
  className?: string
  localization?: Partial<SignInLocalization>
  socialLayout?: SocialLayout
}

/**
 * Renders the sign-in UI with email/password, magic link, and social provider options based on the provided auth configuration.
 *
 * The component handles sign-in submission, offers a resend verification action when the account is unverified, refetches the session on successful sign-in, and navigates to the configured redirect path.
 *
 * @returns A React element for the sign-in form and related controls configured according to the auth settings
 */
export function SignIn({ className, ...props }: SignInProps) {
  const localization = { ...SignIn.localization, ...props.localization }

  const {
    authClient,
    basePaths,
    baseURL,
    emailAndPassword,
    magicLink,
    redirectTo,
    socialProviders,
    viewPaths,
    navigate,
    Link
  } = useAuth(props)

  const { refetch } = authClient.useSession()

  const [password, setPassword] = useState("")
  const [isPending, setIsPending] = useState(false)

  const showSeparator =
    emailAndPassword?.enabled && socialProviders && socialProviders.length > 0

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)

    const formData = new FormData(e.currentTarget)

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const rememberMe = formData.get("rememberMe") === "on"

    const { error } = await authClient.signIn.email(
      {
        email,
        password,
        ...(emailAndPassword?.rememberMe && { rememberMe })
      },
      { disableSignal: true }
    )

    if (error) {
      if (error.code === "EMAIL_NOT_VERIFIED") {
        toast.error(error.message, {
          action: (
            <ResendVerificationButton
              authClient={authClient}
              baseURL={baseURL}
              email={email}
              localization={localization}
              redirectTo={redirectTo}
            />
          )
        })
      } else {
        toast.error(error.message)
      }

      setPassword("")
      setIsPending(false)
      return
    }

    await refetch()
    navigate(redirectTo)
    setIsPending(false)
  }

  return (
    <Card className={cn("w-full max-w-sm p-4 md:p-6", className)}>
      <Card.Content>
        <Form onSubmit={onSubmit}>
          <Fieldset className="gap-4">
            <Fieldset.Legend className="text-xl">
              {localization.SIGN_IN}
            </Fieldset.Legend>

            <Description />

            {emailAndPassword?.enabled && (
              <>
                <Fieldset.Group>
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

                  <TextField
                    minLength={8}
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    isDisabled={isPending}
                    value={password}
                    onChange={setPassword}
                  >
                    <div className="flex justify-between">
                      <Label>{localization.PASSWORD}</Label>

                      {!emailAndPassword?.rememberMe &&
                        emailAndPassword?.forgotPassword && (
                          <Link
                            href={`${basePaths.auth}/${viewPaths.auth.forgotPassword}`}
                            className="link link--underline-hover text-muted"
                          >
                            {localization.FORGOT_PASSWORD}
                          </Link>
                        )}
                    </div>

                    <Input
                      className="text-base md:text-sm"
                      placeholder={localization.PASSWORD_PLACEHOLDER}
                      required
                    />

                    <FieldError className="text-wrap" />
                  </TextField>
                </Fieldset.Group>

                {emailAndPassword?.rememberMe && (
                  <div className="flex justify-between mt-1">
                    <Checkbox name="rememberMe" isDisabled={isPending}>
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>

                      <Checkbox.Content>
                        <Label>{localization.REMEMBER_ME}</Label>
                      </Checkbox.Content>
                    </Checkbox>

                    {emailAndPassword?.forgotPassword && (
                      <Link
                        href={`${basePaths.auth}/${viewPaths.auth.forgotPassword}`}
                        className="link link--underline-hover text-muted"
                      >
                        {localization.FORGOT_PASSWORD}
                      </Link>
                    )}
                  </div>
                )}

                <Fieldset.Actions className="flex-col gap-3">
                  <Button
                    type="submit"
                    className="w-full"
                    isPending={isPending}
                  >
                    {isPending && <Spinner color="current" size="sm" />}

                    {localization.SIGN_IN}
                  </Button>

                  {magicLink && (
                    <MagicLinkButton
                      view="signIn"
                      isPending={isPending}
                      localization={localization}
                    />
                  )}
                </Fieldset.Actions>
              </>
            )}

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
              <Description className="flex justify-center gap-1 text-foreground text-sm">
                {localization.NEED_TO_CREATE_AN_ACCOUNT}

                <Link
                  href={`${basePaths.auth}/${viewPaths.auth.signUp}`}
                  className="link link--underline-hover text-accent"
                >
                  {localization.SIGN_UP}
                </Link>
              </Description>
            )}
          </Fieldset>
        </Form>
      </Card.Content>
    </Card>
  )
}

SignIn.localization = signInLocalization
