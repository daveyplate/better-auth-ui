"use client"

import { type AuthConfig, cn, useAuth } from "@better-auth-ui/react"
import {
  Button,
  Card,
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
import { ProviderButtons } from "./provider-buttons"

const localization = {
  ...MagicLinkButton.localization,
  ...ProviderButtons.localization,
  ALREADY_HAVE_AN_ACCOUNT: "Already have an account?",
  EMAIL: "Email",
  ENTER_YOUR_EMAIL: "Enter your email",
  ENTER_YOUR_NAME: "Enter your name",
  ENTER_YOUR_PASSWORD: "Enter your password",
  NAME: "Name",
  OR: "OR",
  PASSWORD: "Password",
  SIGN_IN: "Sign In",
  SIGN_UP: "Sign Up",
  VERIFY_YOUR_EMAIL: "Please verify your email before signing in"
}

export type SignUpLocalization = typeof localization

export type SignUpProps = DeepPartial<AuthConfig> & {
  className?: string
  localization?: Partial<SignUpLocalization>
}

export function SignUp({ className, ...props }: SignUpProps) {
  const localization = { ...SignUp.localization, ...props.localization }

  const {
    authClient,
    navigate,
    Link,
    socialProviders,
    magicLink,
    basePaths,
    emailAndPassword,
    redirectTo,
    viewPaths
  } = useAuth(props)
  const { refetch } = authClient.useSession()
  const [isPending, setIsPending] = useState(false)
  const [password, setPassword] = useState("")

  const showSeparator = socialProviders && socialProviders.length > 0

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

    if (error) {
      toast.error(error.message || error.status)
      setPassword("")
      setIsPending(false)

      return
    }

    if (emailAndPassword?.requireEmailVerification) {
      toast.success(localization.VERIFY_YOUR_EMAIL)
      navigate(`${basePaths.auth}/${viewPaths.auth.signIn}`)
      setIsPending(false)
      return
    }

    await refetch()
    navigate(redirectTo)
    setIsPending(false)
  }

  return (
    <Card className={cn("w-full max-w-sm md:p-6 gap-6", className)}>
      <Card.Header className="text-xl font-medium">
        {localization.SIGN_UP}
      </Card.Header>

      <Card.Content>
        <Form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <div className="flex flex-col gap-4">
            <TextField name="name" type="text" autoComplete="name">
              <Label>{localization.NAME}</Label>

              <Input
                placeholder={localization.ENTER_YOUR_NAME}
                required
                disabled={isPending}
              />

              <FieldError />
            </TextField>

            <TextField name="email" type="email" autoComplete="email">
              <Label>{localization.EMAIL}</Label>

              <Input
                placeholder={localization.ENTER_YOUR_EMAIL}
                required
                disabled={isPending}
              />

              <FieldError />
            </TextField>

            <TextField
              minLength={8}
              name="password"
              type="password"
              autoComplete="new-password"
            >
              <Label>{localization.PASSWORD}</Label>

              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={localization.ENTER_YOUR_PASSWORD}
                required
                disabled={isPending}
              />

              <FieldError />
            </TextField>
          </div>

          <div className="flex flex-col gap-4">
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
          </div>

          {showSeparator && (
            <>
              <div className="flex items-center gap-4">
                <Separator className="flex-1 bg-surface-quaternary" />

                <p className="text-xs text-muted shrink-0">{localization.OR}</p>

                <Separator className="flex-1 bg-surface-quaternary" />
              </div>

              <div className="flex flex-col gap-4">
                {socialProviders && socialProviders.length > 0 && (
                  <ProviderButtons
                    {...props}
                    isPending={isPending}
                    setIsPending={setIsPending}
                    localization={localization}
                  />
                )}
              </div>
            </>
          )}

          <p className="text-sm justify-center flex gap-2 items-center mb-1">
            {localization.ALREADY_HAVE_AN_ACCOUNT}
            <Link
              href={`${basePaths.auth}/${viewPaths.auth.signIn}`}
              className="link link--underline-always text-accent"
            >
              {localization.SIGN_IN}
            </Link>
          </p>
        </Form>
      </Card.Content>
    </Card>
  )
}

SignUp.localization = localization
