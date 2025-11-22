"use client"

import { type AuthClient, useAuthConfig } from "@better-auth-ui/react"
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
import { type FormEvent, useState } from "react"
import { toast } from "sonner"
import type { AuthProps } from "./auth"
import { ProviderButtons } from "./provider-buttons"

export type SignInProps<TAuthClient extends AuthClient> = Omit<
  AuthProps<TAuthClient>,
  "view"
>

export function SignIn<TAuthClient extends AuthClient>({
  className,
  ...props
}: SignInProps<TAuthClient>) {
  const { emailAndPassword, authClient, navigate, Link, socialProviders } =
    useAuthConfig(props)
  const { refetch } = authClient.useSession()
  const [isPending, setIsPending] = useState(false)
  const [password, setPassword] = useState("")

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
        rememberMe
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
    <Card className="w-full max-w-sm md:p-6 gap-6" {...props}>
      <Card.Header className="text-xl font-medium">Sign In</Card.Header>

      <Card.Content>
        <Form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <div className="flex flex-col gap-4">
            <TextField name="email" type="email" autoComplete="email">
              <Label>Email</Label>

              <Input
                placeholder="Enter your email"
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
              <Label>Password</Label>

              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isPending}
              />

              <FieldError />
            </TextField>
          </div>

          {emailAndPassword?.rememberMe && (
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
                Remember me
              </Label>
            </div>
          )}

          <Button type="submit" className="w-full" isPending={isPending}>
            {isPending && <Spinner color="current" size="sm" />}
            Sign In
          </Button>

          {socialProviders && socialProviders.length > 0 && (
            <>
              <div className="flex items-center gap-4">
                <Separator className="flex-1 bg-surface-quaternary" />

                <p className="text-xs text-muted shrink-0">OR</p>

                <Separator className="flex-1 bg-surface-quaternary" />
              </div>

              <ProviderButtons
                providers={socialProviders}
                isPending={isPending}
                setIsPending={setIsPending}
              />
            </>
          )}

          <Link href="/" className="link link--underline-hover mx-auto">
            Forgot password?
          </Link>

          <p className="text-sm justify-center flex gap-2 items-center mb-1">
            Need to create an account?
            <Link
              href="/auth/sign-up"
              className="link link--underline-always text-accent"
            >
              Sign Up
            </Link>
          </p>
        </Form>
      </Card.Content>
    </Card>
  )
}
