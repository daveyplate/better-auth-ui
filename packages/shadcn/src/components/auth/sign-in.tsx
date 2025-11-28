"use client"

import { type AuthConfig, cn, useAuth } from "@better-auth-ui/react"
import type { DeepPartial } from "better-auth/client/plugins"
import { Loader2 } from "lucide-react"
import { type FormEvent, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Field, FieldError, FieldLabel } from "../ui/field"
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
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string
    password?: string
  }>({})

  const showSeparator =
    emailAndPassword?.enabled && socialProviders && socialProviders.length > 0

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)

    const formData = new FormData(e.currentTarget)

    const email = formData.get("email") as string
    const rememberMe = formData.get("rememberMe") === "on"

    const { error } = await authClient.signIn.email(
      {
        email,
        password,
        ...(emailAndPassword?.rememberMe && { rememberMe: rememberMe })
      },
      { disableSignal: true }
    )

    setIsPending(false)

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
      return
    }

    await refetch()
    navigate(redirectTo)
  }

  return (
    <Card className={cn("w-full max-w-sm py-4 md:py-6", className)}>
      <CardHeader className="flex px-4 md:px-6">
        <CardTitle className="text-xl">{localization.SIGN_IN}</CardTitle>
      </CardHeader>

      <CardContent className="px-4 md:px-6">
        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          {emailAndPassword?.enabled && (
            <>
              <div className="flex flex-col gap-4">
                <Field className="gap-2" data-invalid={!!fieldErrors.email}>
                  <FieldLabel htmlFor="email">{localization.EMAIL}</FieldLabel>

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={localization.EMAIL_PLACEHOLDER}
                    required
                    disabled={isPending}
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

                <Field className="gap-2" data-invalid={!!fieldErrors.password}>
                  <div className="flex justify-between items-center">
                    <FieldLabel htmlFor="password">
                      {localization.PASSWORD}
                    </FieldLabel>

                    {!emailAndPassword?.rememberMe &&
                      emailAndPassword?.forgotPassword && (
                        <Link
                          href={`${basePaths.auth}/${viewPaths.auth.forgotPassword}`}
                          className="text-sm underline-offset-4 text-card-foreground! hover:underline"
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
                    placeholder={localization.PASSWORD_PLACEHOLDER}
                    required
                    minLength={8}
                    value={password}
                    disabled={isPending}
                    onChange={(e) => {
                      setPassword(e.target.value)

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
              </div>

              {emailAndPassword.rememberMe && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="rememberMe"
                      name="rememberMe"
                      disabled={isPending}
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
                      className="text-sm underline-offset-4 hover:underline"
                    >
                      {localization.FORGOT_PASSWORD}
                    </Link>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending && <Loader2 className="size-4 animate-spin" />}
                  {localization.SIGN_IN}
                </Button>

                {magicLink && (
                  <MagicLinkButton
                    view="signIn"
                    isPending={isPending}
                    localization={localization}
                  />
                )}
              </div>
            </>
          )}

          {showSeparator && (
            <div className="flex items-center gap-4">
              <Separator className="flex-1" />

              <p className="text-xs text-muted-foreground shrink-0">
                {localization.OR}
              </p>

              <Separator className="flex-1" />
            </div>
          )}

          {socialProviders && socialProviders.length > 0 && (
            <div className="flex flex-col gap-4">
              <ProviderButtons
                {...props}
                isPending={isPending}
                setIsPending={setIsPending}
                localization={localization}
              />
            </div>
          )}

          {emailAndPassword?.enabled && (
            <p className="text-sm justify-center flex gap-2 items-center text-muted-foreground">
              {localization.NEED_TO_CREATE_AN_ACCOUNT}

              <Link
                href={`${basePaths.auth}/${viewPaths.auth.signUp}`}
                className="underline underline-offset-4"
              >
                {localization.SIGN_UP}
              </Link>
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

SignIn.localization = signInLocalization
