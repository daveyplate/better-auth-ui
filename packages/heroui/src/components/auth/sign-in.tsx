import {
  type AnyAuthConfig,
  useSignInEmail,
  useSignInSocial
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

import { useAuth } from "../../hooks/use-auth"
import { cn } from "../../lib/utils"
import { FieldSeparator } from "./field-separator"
import { MagicLinkButton } from "./magic-link-button"
import { ProviderButtons, type SocialLayout } from "./provider-buttons"

export type SignInProps = AnyAuthConfig & {
  className?: string
  socialLayout?: SocialLayout
  socialPosition?: "top" | "bottom"
}

/**
 * Renders the sign-in UI with email/password, magic link, and social provider options based on the provided auth configuration.
 */
export function SignIn({
  className,
  socialLayout,
  socialPosition = "bottom",
  ...props
}: SignInProps) {
  const config = useAuth(props)

  const {
    basePaths,
    emailAndPassword,
    localization,
    magicLink,
    socialProviders,
    viewPaths,
    Link
  } = config

  const [{ email, password }, signInEmail, signInPending] =
    useSignInEmail(config)
  const [_, signInSocial, socialPending] = useSignInSocial(config)

  const isPending = signInPending || socialPending

  const showSeparator =
    emailAndPassword?.enabled && socialProviders && socialProviders.length > 0

  return (
    <Card className={cn("w-full max-w-sm p-4 md:p-6", className)}>
      <Card.Content>
        <Fieldset className="gap-4">
          <Fieldset.Legend className="text-xl">
            {localization.auth.signIn}
          </Fieldset.Legend>

          <Description />

          {socialPosition === "top" && (
            <>
              {socialProviders && socialProviders.length > 0 && (
                <ProviderButtons
                  {...config}
                  socialLayout={socialLayout}
                  signInSocial={signInSocial}
                  isPending={isPending}
                />
              )}

              {showSeparator && (
                <FieldSeparator>{localization.auth.or}</FieldSeparator>
              )}
            </>
          )}

          {emailAndPassword?.enabled && (
            <Form action={signInEmail} className="flex flex-col gap-4">
              <Fieldset.Group>
                <TextField
                  defaultValue={email}
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
                    disabled={isPending}
                  />

                  <FieldError className="text-wrap" />
                </TextField>

                <TextField
                  defaultValue={password}
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
                  <Checkbox name="rememberMe" isDisabled={isPending}>
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
                <Button type="submit" className="w-full" isPending={isPending}>
                  {isPending && <Spinner color="current" size="sm" />}

                  {localization.auth.signIn}
                </Button>

                {magicLink && (
                  <MagicLinkButton
                    {...config}
                    view="signIn"
                    isPending={isPending}
                  />
                )}
              </Fieldset.Actions>
            </Form>
          )}

          {socialPosition === "bottom" && (
            <>
              {showSeparator && (
                <FieldSeparator>{localization.auth.or}</FieldSeparator>
              )}

              {socialProviders && socialProviders.length > 0 && (
                <ProviderButtons
                  {...config}
                  socialLayout={socialLayout}
                  signInSocial={signInSocial}
                  isPending={isPending}
                />
              )}
            </>
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
      </Card.Content>
    </Card>
  )
}
