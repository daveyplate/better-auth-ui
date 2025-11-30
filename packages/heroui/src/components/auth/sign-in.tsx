import {
  type AnyAuthConfig,
  useSignIn
} from "@better-auth-ui/react"
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
import { useState } from "react"

import { useAuth } from "../../hooks/use-auth"
import { cn } from "../../lib/utils"
import { FieldSeparator } from "./field-separator"
import { MagicLinkButton } from "./magic-link-button"
import { ProviderButtons, type SocialLayout } from "./provider-buttons"

export type SignInProps = AnyAuthConfig & {
  className?: string
  socialLayout?: SocialLayout
}

/**
 * Renders the sign-in UI with email/password, magic link, and social provider options based on the provided auth configuration.
 *
 * The component handles sign-in submission, offers a resend verification action when the account is unverified, refetches the session on successful sign-in, and navigates to the configured redirect path.
 *
 * @returns A React element for the sign-in form and related controls configured according to the auth settings
 */
export function SignIn({ className, socialLayout, ...config }: SignInProps) {
  const {
    basePaths,
    emailAndPassword,
    localization,
    magicLink,
    socialProviders,
    viewPaths,
    Link
  } = useAuth(config)

  const [state, formAction, isPending] = useSignIn(config)
  const [socialIsPending, setSocialIsPending] = useState(false)

  const isSubmitting = isPending || socialIsPending

  const showSeparator =
    emailAndPassword?.enabled && socialProviders && socialProviders.length > 0

  return (
    <Card className={cn("w-full max-w-sm p-4 md:p-6", className)}>
      <Card.Content>
        <Form action={formAction}>
          <Fieldset className="gap-4">
            <Fieldset.Legend className="text-xl">
              {localization.auth.signIn}
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
                    isDisabled={isSubmitting}
                  >
                    <Label>{localization.auth.email}</Label>

                    <Input
                      className="text-base md:text-sm"
                      placeholder={localization.auth.emailPlaceholder}
                      required
                      disabled={isSubmitting}
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
                      <Label>{localization.auth.password}</Label>

                      {!emailAndPassword?.rememberMe &&
                        emailAndPassword?.forgotPassword && (
                          <Link
                            href={`${basePaths.auth}/${viewPaths.auth.forgotPassword}`}
                            className="link link--underline-hover text-muted"
                          >
                            {localization.auth.forgotPassword}
                          </Link>
                        )}
                    </div>

                    <Input
                      className="text-base md:text-sm"
                      placeholder={localization.auth.passwordPlaceholder}
                      required
                    />

                    <FieldError className="text-wrap" />
                  </TextField>
                </Fieldset.Group>

                {emailAndPassword?.rememberMe && (
                  <div className="flex justify-between mt-1">
                    <Checkbox name="rememberMe" isDisabled={isSubmitting}>
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>

                      <Checkbox.Content>
                        <Label>{localization.auth.rememberMe}</Label>
                      </Checkbox.Content>
                    </Checkbox>

                    {emailAndPassword?.forgotPassword && (
                      <Link
                        href={`${basePaths.auth}/${viewPaths.auth.forgotPassword}`}
                        className="link link--underline-hover text-muted"
                      >
                        {localization.auth.forgotPassword}
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

                    {localization.auth.signIn}
                  </Button>

                  {magicLink && (
                    <MagicLinkButton
                      {...config}
                      view="signIn"
                      isPending={isSubmitting}
                    />
                  )}
                </Fieldset.Actions>
              </>
            )}

            {showSeparator && (
              <FieldSeparator>{localization.auth.or}</FieldSeparator>
            )}

            {socialProviders && socialProviders.length > 0 && (
              <ProviderButtons
                {...config}
                isPending={isSubmitting}
                setIsPending={setSocialIsPending}
                localization={localization}
                socialLayout={socialLayout}
              />
            )}

            {emailAndPassword?.enabled && (
              <Description className="flex justify-center gap-1.5 text-foreground text-sm">
                {localization.auth.needToCreateAnAccount}

                <Link
                  href={`${basePaths.auth}/${viewPaths.auth.signUp}`}
                  className="link link--underline-hover text-accent"
                >
                  {localization.auth.signUp}
                </Link>
              </Description>
            )}
          </Fieldset>
        </Form>
      </Card.Content>
    </Card>
  )
}