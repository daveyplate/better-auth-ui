import type { AnyAuthConfig } from "@better-auth-ui/react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"

import { useAuth } from "@/hooks/auth/use-auth"
import { useSignIn, useSignInLocalization } from "@/hooks/auth/use-sign-in"
import { cn } from "@/lib/utils"
import { MagicLinkButton } from "./magic-link-button"
import { ProviderButtons, type SocialLayout } from "./provider-buttons"

const signInLocalization = {
  ...MagicLinkButton.localization,
  ...ProviderButtons.localization,
  ...useSignInLocalization,
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

export type SignInProps = AnyAuthConfig<SignInLocalization> & {
  className?: string
  socialLayout?: SocialLayout
}

export function SignIn({ className, socialLayout, ...props }: SignInProps) {
  const config = useAuth(props)

  const {
    basePaths,
    emailAndPassword,
    magicLink,
    socialProviders,
    viewPaths,
    Link
  } = config

  const localization = { ...SignIn.localization, ...config.localization }

  const [state, formAction, isPending] = useSignIn({ ...config, localization })
  const [socialIsPending, setSocialIsPending] = useState(false)

  const isSubmitting = isPending || socialIsPending

  const [fieldErrors, setFieldErrors] = useState<{
    email?: string
    password?: string
  }>({})

  const showSeparator =
    emailAndPassword?.enabled && socialProviders && socialProviders.length > 0

  return (
    <Card className={cn("w-full max-w-sm py-4 md:py-6", className)}>
      <CardHeader className="px-4 md:px-6 -mb-4">
        <CardTitle className="text-xl">{localization.SIGN_IN}</CardTitle>
      </CardHeader>

      <CardContent className="px-4 md:px-6">
        <form action={formAction}>
          <FieldGroup className="gap-4">
            {emailAndPassword?.enabled && (
              <>
                <Field data-invalid={!!fieldErrors.email} className="gap-1">
                  <FieldLabel htmlFor="email">{localization.EMAIL}</FieldLabel>

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    defaultValue={state.email}
                    placeholder={localization.EMAIL_PLACEHOLDER}
                    required
                    disabled={isSubmitting}
                    onChange={() => {
                      setFieldErrors((prev) => ({
                        ...prev,
                        email: undefined
                      }))
                    }}
                    onInvalid={(e) => {
                      e.preventDefault()
                      setFieldErrors((prev) => ({
                        ...prev,
                        email: (e.target as HTMLInputElement).validationMessage
                      }))
                    }}
                    aria-invalid={!!fieldErrors.email}
                  />

                  <FieldError>{fieldErrors.email}</FieldError>
                </Field>

                <Field data-invalid={!!fieldErrors.password} className="gap-1">
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">
                      {localization.PASSWORD}
                    </FieldLabel>

                    {!emailAndPassword?.rememberMe &&
                      emailAndPassword?.forgotPassword && (
                        <Link
                          href={`${basePaths.auth}/${viewPaths.auth.forgotPassword}`}
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-card-foreground!"
                        >
                          {localization.FORGOT_PASSWORD}
                        </Link>
                      )}
                  </div>

                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    defaultValue={state.password}
                    placeholder={localization.PASSWORD_PLACEHOLDER}
                    required
                    minLength={8}
                    disabled={isSubmitting}
                    onChange={() => {
                      setFieldErrors((prev) => ({
                        ...prev,
                        password: undefined
                      }))
                    }}
                    onInvalid={(e) => {
                      e.preventDefault()

                      setFieldErrors((prev) => ({
                        ...prev,
                        password: (e.target as HTMLInputElement)
                          .validationMessage
                      }))
                    }}
                    aria-invalid={!!fieldErrors.password}
                  />

                  <FieldError>{fieldErrors.password}</FieldError>
                </Field>

                {emailAndPassword.rememberMe && (
                  <Field className="my-1">
                    <div className="flex items-center">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="rememberMe"
                          name="rememberMe"
                          disabled={isSubmitting}
                        />

                        <Label
                          htmlFor="rememberMe"
                          className="cursor-pointer text-sm font-normal"
                        >
                          {localization.REMEMBER_ME}
                        </Label>
                      </div>

                      {emailAndPassword?.forgotPassword && (
                        <Link
                          href={`${basePaths.auth}/${viewPaths.auth.forgotPassword}`}
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-card-foreground!"
                        >
                          {localization.FORGOT_PASSWORD}
                        </Link>
                      )}
                    </div>
                  </Field>
                )}
              </>
            )}

            <Field>
              <Button type="submit" disabled={isSubmitting}>
                {isPending && <Spinner />}

                {localization.SIGN_IN}
              </Button>

              {magicLink && (
                <MagicLinkButton
                  view="signIn"
                  isPending={isSubmitting}
                  localization={localization}
                />
              )}
            </Field>

            {showSeparator && (
              <FieldSeparator className="m-0 text-xs flex items-center">
                {localization.OR}
              </FieldSeparator>
            )}

            {socialProviders && socialProviders.length > 0 && (
              <ProviderButtons
                {...props}
                isPending={isSubmitting}
                setIsPending={setSocialIsPending}
                localization={localization}
                socialLayout={socialLayout}
              />
            )}

            {emailAndPassword?.enabled && (
              <FieldDescription className="flex justify-center gap-1">
                {localization.NEED_TO_CREATE_AN_ACCOUNT}

                <Link
                  href={`${basePaths.auth}/${viewPaths.auth.signUp}`}
                  className="underline underline-offset-4"
                >
                  {localization.SIGN_UP}
                </Link>
              </FieldDescription>
            )}
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

SignIn.localization = signInLocalization
