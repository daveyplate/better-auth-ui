"use client"

import { type AuthConfig, cn } from "@better-auth-ui/react"
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
import { useState } from "react"

import { useAuth } from "../../hooks/use-auth"
import { useSignIn } from "../../hooks/use-sign-in"
import { FieldSeparator } from "./field-separator"
import { MagicLinkButton } from "./magic-link-button"
import { ProviderButtons, type SocialLayout } from "./provider-buttons"

const signInLocalization = {
  ...MagicLinkButton.localization,
  ...ProviderButtons.localization,
  EMAIL: "Email",
  EMAIL_PLACEHOLDER: "Enter your email",
  FORGOT_PASSWORD: "Forgot password?",
  PASSWORD: "Password",
  PASSWORD_PLACEHOLDER: "Enter your password",
  NEED_TO_CREATE_AN_ACCOUNT: "Need to create an account?",
  OR: "OR",
  REMEMBER_ME: "Remember me",
  RESEND: "Resend",
  SIGN_IN: "Sign In",
  SIGN_UP: "Sign Up",
  VERIFICATION_EMAIL_SENT: "Verification email sent!"
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

  const config = useAuth(props)

  const {
    basePaths,
    emailAndPassword,
    magicLink,
    socialProviders,
    viewPaths,
    Link
  } = config

  const [state, formAction, isPending] = useSignIn({
    config,
    localization
  })

  const [socialIsPending, setSocialIsPending] = useState(false)

  const isAnyPending = isPending || socialIsPending

  const showSeparator =
    emailAndPassword?.enabled && socialProviders && socialProviders.length > 0

  return (
    <Card className={cn("w-full max-w-sm p-4 md:p-6", className)}>
      <Card.Content>
        <Form action={formAction}>
          <Fieldset className="gap-4">
            <Fieldset.Legend className="text-xl">
              {localization.SIGN_IN}
            </Fieldset.Legend>

            <Description />

            {emailAndPassword?.enabled && (
              <>
                <Fieldset.Group>
                  <TextField
                    defaultValue={state.email}
                    name="email"
                    type="email"
                    autoComplete="email"
                    isDisabled={isAnyPending}
                  >
                    <Label>{localization.EMAIL}</Label>

                    <Input
                      className="text-base md:text-sm"
                      placeholder={localization.EMAIL_PLACEHOLDER}
                      required
                      disabled={isAnyPending}
                    />

                    <FieldError className="text-wrap" />
                  </TextField>

                  <TextField
                    defaultValue={state.password}
                    minLength={8}
                    name="password"
                    type="password"
                    autoComplete="current-password"
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
                    <Checkbox name="rememberMe" isDisabled={isAnyPending}>
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
                      isPending={isAnyPending}
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
                isPending={isAnyPending}
                setIsPending={setSocialIsPending}
                localization={localization}
              />
            )}

            {emailAndPassword?.enabled && (
              <Description className="flex justify-center gap-1.5 text-foreground text-sm">
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
