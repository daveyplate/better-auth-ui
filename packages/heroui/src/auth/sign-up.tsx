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

export type SignUpProps<TAuthClient extends AuthClient> = Omit<
  AuthProps<TAuthClient>,
  "view"
>

export function SignUp<TAuthClient extends AuthClient>({
  className,
  ...props
}: SignUpProps<TAuthClient>) {
  const { authClient, navigate, Link } = useAuthConfig(props)
  const { refetch } = authClient.useSession()
  const [isPending, setIsPending] = useState(false)
  const [password, setPassword] = useState("")

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)

    const { name, email } = Object.fromEntries(new FormData(e.currentTarget))

    const { error } = await authClient.$fetch("/sign-up/email", {
      method: "POST",
      body: {
        name: name,
        email: email,
        password
      }
    })

    if (error) {
      toast.error(error.message)
      setPassword("")
      setIsPending(false)

      return
    }

    refetch()
    navigate?.("/dashboard")
    setIsPending(false)
  }

  return (
    <Card className="w-full max-w-sm md:p-6 gap-6" {...props}>
      <Card.Header className="text-xl font-medium">Sign Up</Card.Header>

      <Card.Content>
        <Form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <div className="flex flex-col gap-4">
            <TextField name="name" type="text" autoComplete="name">
              <Label>Name</Label>

              <Input
                placeholder="Enter your name"
                required
                disabled={isPending}
              />

              <FieldError />
            </TextField>

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
              autoComplete="new-password"
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

          <div className="hidden w-full items-center justify-between px-1">
            <div className="hidden items-center gap-2">
              <Checkbox id="remember-me">
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
              </Checkbox>

              <Label htmlFor="remember-me" className="cursor-pointer">
                Remember me
              </Label>
            </div>
          </div>

          <Button type="submit" className="w-full" isPending={isPending}>
            {isPending && <Spinner color="current" size="sm" />}
            Sign Up
          </Button>

          <div className="flex items-center gap-4">
            <Separator className="flex-1 bg-surface-quaternary" />

            <p className="text-xs text-muted shrink-0">OR</p>

            <Separator className="flex-1 bg-surface-quaternary" />
          </div>

          <div className="flex flex-col gap-4">
            <Button variant="tertiary" className="w-full" onClick={() => {}}>
              Continue with Google
            </Button>

            <Button variant="tertiary" className="w-full" onClick={() => {}}>
              Continue with Github
            </Button>
          </div>

          <p className="text-sm justify-center flex gap-2 items-center mb-1">
            Already have an account?
            <Link
              href="/auth/sign-in"
              className="link link--underline-always text-accent"
            >
              Sign In
            </Link>
          </p>
        </Form>
      </Card.Content>
    </Card>
  )
}
