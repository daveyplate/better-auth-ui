"use client"

import { type AuthClient, useAuthConfig } from "@better-auth-ui/react"
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
import { type FormEvent, useState } from "react"
import { toast } from "sonner"
import type { AuthProps } from "./auth"
import { MagicLinkButton } from "./magic-link-button"
import { ProviderButtons } from "./provider-buttons"

export type MagicLinkProps<TAuthClient extends AuthClient> = Omit<
  AuthProps<TAuthClient>,
  "view"
>

export function MagicLink<TAuthClient extends AuthClient>({
  className,
  ...props
}: MagicLinkProps<TAuthClient>) {
  const { authClient, Link, socialProviders, magicLink } = useAuthConfig(props)
  const [isPending, setIsPending] = useState(false)

  const showSeparator =
    (socialProviders && socialProviders.length > 0) || magicLink

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string

    const { error } = await authClient.$fetch("/sign-in/magic-link", {
      method: "POST",
      body: {
        email
      }
    })

    if (error) {
      toast.error(error.message)
      setIsPending(false)

      return
    }

    toast.success("Magic link sent to your email!")
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
          </div>

          <div className="flex flex-col gap-4">
            <Button type="submit" className="w-full" isPending={isPending}>
              {isPending && <Spinner color="current" size="sm" />}
              Send Magic Link
            </Button>

            {magicLink && (
              <MagicLinkButton view="magic-link" isPending={isPending} />
            )}
          </div>

          {showSeparator && (
            <>
              <div className="flex items-center gap-4">
                <Separator className="flex-1 bg-surface-quaternary" />

                <p className="text-xs text-muted shrink-0">OR</p>

                <Separator className="flex-1 bg-surface-quaternary" />
              </div>

              <div className="flex flex-col gap-4">
                {socialProviders && socialProviders.length > 0 && (
                  <ProviderButtons
                    providers={socialProviders}
                    isPending={isPending}
                    setIsPending={setIsPending}
                  />
                )}
              </div>
            </>
          )}

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
