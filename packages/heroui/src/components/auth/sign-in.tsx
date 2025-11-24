"use client"

import {
  type AuthClient,
  type AuthConfig,
  cn,
  useAuthConfig
} from "@better-auth-ui/react"
import {
  Button,
  Card,
  type CardProps,
  Checkbox,
  FieldError,
  Form,
  Input,
  Label,
  Separator,
  Spinner,
  TextField
} from "@heroui/react"
import { type FormEvent, useState } from "react"
import { toast } from "sonner"
import {
  MagicLinkButton,
  magicLinkButtonLocalization
} from "./magic-link-button"
import {
  ProviderButtons,
  providerButtonsLocalization
} from "./provider-buttons"

export const signInLocalization = {
  ...magicLinkButtonLocalization,
  ...providerButtonsLocalization,
  EMAIL: "Email",
  ENTER_YOUR_EMAIL: "Enter your email",
  ENTER_YOUR_PASSWORD: "Enter your password",
  FORGOT_PASSWORD: "Forgot password?",
  NEED_TO_CREATE_AN_ACCOUNT: "Need to create an account?",
  PASSWORD: "Password",
  REMEMBER_ME: "Remember me",
  SIGN_IN: "Sign In",
  SIGN_UP: "Sign Up"
}

export type SignInLocalization = typeof signInLocalization

export type SignInProps<TAuthClient extends AuthClient> = CardProps &
  Partial<AuthConfig<TAuthClient>> & {
    localization?: Partial<SignInLocalization>
  }

export function SignIn<TAuthClient extends AuthClient>({
  className,
  localization,
  ...props
}: SignInProps<TAuthClient>) {
  localization = { ...signInLocalization, ...localization }

  const {
    emailAndPassword,
    authClient,
    navigate,
    Link,
    socialProviders,
    magicLink
  } = useAuthConfig(props)
  const { refetch } = authClient.useSession()
  const [isPending, setIsPending] = useState(false)
  const [password, setPassword] = useState("")

  const showSeparator =
    emailAndPassword?.enabled &&
    ((socialProviders && socialProviders.length > 0) || magicLink)

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
        ...(emailAndPassword?.rememberMe && { rememberMe })
      },
      { disableSignal: true }
    )

    if (error) {
      toast.error(error.message)
      setPassword("")
      setIsPending(false)

      return
    }

    await refetch()
    navigate?.("/dashboard")
    setIsPending(false)
  }

  return (
    <Card className={cn("w-full max-w-sm md:p-6 gap-6", className)} {...props}>
      <Card.Header className="text-xl font-medium">
        {localization.SIGN_IN}
      </Card.Header>

      <Card.Content>
        <Form className="flex flex-col gap-6" onSubmit={onSubmit}>
          {emailAndPassword?.enabled && (
            <>
              <div className="flex flex-col gap-4">
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
                  autoComplete="current-password"
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

              {emailAndPassword.rememberMe && (
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
              )}
            </>
          )}

          {emailAndPassword?.enabled && (
            <div className="flex flex-col gap-4">
              <Button type="submit" className="w-full" isPending={isPending}>
                {isPending && <Spinner color="current" size="sm" />}
                {localization.SIGN_IN}
              </Button>

              {magicLink && (
                <MagicLinkButton
                  view="sign-in"
                  isPending={isPending}
                  localization={localization}
                />
              )}
            </div>
          )}

          {showSeparator && (
            <div className="flex items-center gap-4">
              <Separator className="flex-1 bg-surface-quaternary" />

              <p className="text-xs text-muted shrink-0">OR</p>

              <Separator className="flex-1 bg-surface-quaternary" />
            </div>
          )}

          {socialProviders && socialProviders.length > 0 && (
            <div className="flex flex-col gap-4">
              <ProviderButtons
                providers={socialProviders}
                isPending={isPending}
                setIsPending={setIsPending}
                localization={localization}
              />
            </div>
          )}

          {emailAndPassword?.enabled && (
            <>
              <Link href="/" className="link link--underline-hover mx-auto">
                {localization.FORGOT_PASSWORD}
              </Link>

              <p className="text-sm justify-center flex gap-2 items-center mb-1">
                {localization.NEED_TO_CREATE_AN_ACCOUNT}
                <Link
                  href="/auth/sign-up"
                  className="link link--underline-always text-accent"
                >
                  {localization.SIGN_UP}
                </Link>
              </p>
            </>
          )}
        </Form>
      </Card.Content>
    </Card>
  )
}
