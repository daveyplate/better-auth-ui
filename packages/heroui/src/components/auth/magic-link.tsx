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

export const magicLinkLocalization = {
  ...magicLinkButtonLocalization,
  ...providerButtonsLocalization,
  EMAIL: "Email",
  ENTER_YOUR_EMAIL: "Enter your email",
  NEED_TO_CREATE_AN_ACCOUNT: "Need to create an account?",
  SEND_MAGIC_LINK: "Send Magic Link",
  SIGN_IN: "Sign In",
  SIGN_UP: "Sign Up"
}

export type MagicLinkLocalization = typeof magicLinkLocalization

export type MagicLinkProps<TAuthClient extends AuthClient> = CardProps &
  Partial<AuthConfig<TAuthClient>> & {
    localization?: Partial<MagicLinkLocalization>
  }

export function MagicLink<TAuthClient extends AuthClient>({
  className,
  localization,
  ...props
}: MagicLinkProps<TAuthClient>) {
  localization = { ...magicLinkLocalization, ...localization }

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
    <Card
      key="auth-card"
      className={cn("w-full max-w-sm md:p-6 gap-6", className)}
      {...props}
    >
      <Card.Header className="text-xl font-medium">
        {localization.SIGN_IN}
      </Card.Header>

      <Card.Content>
        <Form className="flex flex-col gap-6" onSubmit={onSubmit}>
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
          </div>

          <div className="flex flex-col gap-4">
            <Button type="submit" className="w-full" isPending={isPending}>
              {isPending && <Spinner color="current" size="sm" />}
              {localization.SEND_MAGIC_LINK}
            </Button>

            {magicLink && (
              <MagicLinkButton
                view="magic-link"
                isPending={isPending}
                localization={localization}
              />
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
                    localization={localization}
                  />
                )}
              </div>
            </>
          )}

          <p className="text-sm justify-center flex gap-2 items-center mb-1">
            {localization.NEED_TO_CREATE_AN_ACCOUNT}
            <Link
              href="/auth/sign-up"
              className="link link--underline-always text-accent"
            >
              {localization.SIGN_UP}
            </Link>
          </p>
        </Form>
      </Card.Content>
    </Card>
  )
}
