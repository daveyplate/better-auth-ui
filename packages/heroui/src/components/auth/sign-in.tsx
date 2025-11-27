"use client"

import { type AuthConfig, cn, useAuth } from "@better-auth-ui/react"
import {
  Button,
  Card,
  Checkbox,
  FieldError,
  Form,
  Input,
  Label,
  Separator,
  Spinner,
  TextField
} from "@heroui/react"
import type { DeepPartial } from "better-auth/client/plugins"
import { type FormEvent, useState } from "react"
import { toast } from "sonner"

import { MagicLinkButton } from "./magic-link-button"
import { ProviderButtons, type SocialLayout } from "./provider-buttons"
import { ResendVerificationButton } from "./resend-verification-button"

const localization = {
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

export type SignInLocalization = typeof localization

export type SignInProps = DeepPartial<AuthConfig> & {
  className?: string
  localization?: Partial<SignInLocalization>
  socialLayout?: SocialLayout
}

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
  }

  return (
    <Card className={cn("w-full max-w-sm md:p-6 gap-6", className)}>
      <Card.Header className="text-xl font-medium">
        {localization.SIGN_IN}
      </Card.Header>

      <Card.Content>
        <Form className="flex flex-col gap-6" onSubmit={onSubmit}>
          {emailAndPassword?.enabled && (
            <>
              <div className="flex flex-col gap-4">
                <TextField
                  name="email"
                  type="email"
                  autoComplete="email"
                  isDisabled={isPending}
                >
                  <Label>{localization.EMAIL}</Label>

                  <Input
                    placeholder={localization.EMAIL_PLACEHOLDER}
                    required
                  />

                  <FieldError />
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
                          className="link link--underline-hover"
                        >
                          {localization.FORGOT_PASSWORD}
                        </Link>
                      )}
                  </div>

                  <Input
                    placeholder={localization.PASSWORD_PLACEHOLDER}
                    required
                  />

                  <FieldError />
                </TextField>
              </div>

              {emailAndPassword.rememberMe && (
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="rememberMe"
                      name="rememberMe"
                      isDisabled={isPending}
                    >
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                    </Checkbox>

                    <Label htmlFor="rememberMe" className="cursor-pointer">
                      {localization.REMEMBER_ME}
                    </Label>
                  </div>

                  {emailAndPassword?.forgotPassword && (
                    <Link
                      href={`${basePaths.auth}/${viewPaths.auth.forgotPassword}`}
                      className="link link--underline-hover"
                    >
                      {localization.FORGOT_PASSWORD}
                    </Link>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-4">
                <Button type="submit" className="w-full" isPending={isPending}>
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
              </div>
            </>
          )}

          {showSeparator && (
            <div className="flex items-center gap-4">
              <Separator className="flex-1 bg-surface-quaternary" />

              <p className="text-xs text-muted shrink-0">{localization.OR}</p>

              <Separator className="flex-1 bg-surface-quaternary" />
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
            <p className="text-sm justify-center flex gap-2 items-center">
              {localization.NEED_TO_CREATE_AN_ACCOUNT}

              <Link
                href={`${basePaths.auth}/${viewPaths.auth.signUp}`}
                className="link link--underline-always text-accent"
              >
                {localization.SIGN_UP}
              </Link>
            </p>
          )}
        </Form>
      </Card.Content>
    </Card>
  )
}

SignIn.localization = localization
