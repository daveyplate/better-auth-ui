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
import { ProviderButtons, type SocialLayout } from "./provider-buttons"

const magicLinkLocalization = {
  ...MagicLinkButton.localization,
  ...ProviderButtons.localization,
  EMAIL: "Email",
  EMAIL_PLACEHOLDER: "Enter your email",
  MAGIC_LINK_SENT: "Magic link sent to your email",
  NEED_TO_CREATE_AN_ACCOUNT: "Need to create an account?",
  OR: "OR",
  SEND_MAGIC_LINK: "Send Magic Link",
  SIGN_IN: "Sign In",
  SIGN_UP: "Sign Up"
}

export type MagicLinkLocalization = typeof magicLinkLocalization

export type MagicLinkProps = DeepPartial<AuthConfig> & {
  className?: string
  localization?: Partial<MagicLinkLocalization>
  socialLayout?: SocialLayout
}

/**
 * Render a card-based sign-in form that sends an email magic link and optionally shows social provider buttons.
 *
 * Submits the entered email to the auth client, displays success or error toasts, and supports customizable localization and social layout via props.
 *
 * @param props - Component props to configure appearance, localization overrides, social layout, and auth-related options.
 * @returns A JSX element containing the magic-link sign-in user interface and related controls.
 */
export function MagicLink({ className, ...props }: MagicLinkProps) {
  const localization = { ...MagicLink.localization, ...props.localization }

  const {
    authClient,
    basePaths,
    baseURL,
    magicLink,
    socialProviders,
    redirectTo,
    viewPaths,
    Link
  } = useAuth(props)

  const [isPending, setIsPending] = useState(false)
  const showSeparator = socialProviders && socialProviders.length > 0

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    const email = formData.get("email") as string
    const callbackURL = `${baseURL}${redirectTo}`

    const { error } = await authClient.signIn.magicLink({
      email,
      callbackURL
    })

    if (error) {
      toast.error(error.message)
      setIsPending(false)
      return
    }

    form.reset()

    toast.success(localization.MAGIC_LINK_SENT)
    setIsPending(false)
  }

  return (
    <Card className={cn("w-full max-w-sm md:p-6 gap-6", className)}>
      <Card.Header className="text-xl font-medium">
        {localization.SIGN_IN}
      </Card.Header>

      <Card.Content>
        <Form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <TextField
            name="email"
            type="email"
            autoComplete="email"
            isDisabled={isPending}
          >
            <Label>{localization.EMAIL}</Label>

            <Input placeholder={localization.EMAIL_PLACEHOLDER} required />

            <FieldError />
          </TextField>

          <div className="flex flex-col gap-4">
            <Button type="submit" className="w-full" isPending={isPending}>
              {isPending && <Spinner color="current" size="sm" />}

              {localization.SEND_MAGIC_LINK}
            </Button>

            {magicLink && (
              <MagicLinkButton
                view="magicLink"
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

          <p className="text-sm justify-center flex gap-2 items-center">
            {localization.NEED_TO_CREATE_AN_ACCOUNT}

            <Link
              href={`${basePaths.auth}/${viewPaths.auth.signUp}`}
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

MagicLink.localization = magicLinkLocalization
