import type { AnyAuthConfig } from "@better-auth-ui/react"
import {
  Button,
  Card,
  Description,
  FieldError,
  Fieldset,
  Form,
  Input,
  Label,
  Spinner,
  TextField
} from "@heroui/react"
import { type FormEvent, useState } from "react"
import { toast } from "sonner"

import { useAuth } from "../../hooks/use-auth"
import { cn } from "../../lib/utils"

import { FieldSeparator } from "./field-separator"
import { MagicLinkButton } from "./magic-link-button"
import type { SocialLayout } from "./provider-buttons"

export type MagicLinkProps = AnyAuthConfig & {
  className?: string
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
export function MagicLink({
  className,
  socialLayout,
  ...props
}: MagicLinkProps) {
  const {
    authClient,
    basePaths,
    baseURL,
    localization,
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

    setIsPending(false)

    if (error) {
      toast.error(error.message)
      return
    }

    form.reset()

    toast.success(localization.auth.magicLinkSent)
  }

  return (
    <Card className={cn("w-full max-w-sm p-4 md:p-6", className)}>
      <Card.Content>
        <Form onSubmit={onSubmit}>
          <Fieldset className="gap-4">
            <Fieldset.Legend className="text-xl">
              {localization.auth.signIn}
            </Fieldset.Legend>

            <Description />

            <Fieldset.Group>
              <TextField
                name="email"
                type="email"
                autoComplete="email"
                isDisabled={isPending}
              >
                <Label>{localization.auth.email}</Label>

                <Input
                  className="text-base md:text-sm"
                  placeholder={localization.auth.emailPlaceholder}
                  required
                />

                <FieldError className="text-wrap" />
              </TextField>
            </Fieldset.Group>

            <Fieldset.Actions className="flex-col gap-3">
              <Button type="submit" className="w-full" isPending={isPending}>
                {isPending && <Spinner color="current" size="sm" />}

                {localization.auth.sendMagicLink}
              </Button>

              {magicLink && (
                <MagicLinkButton
                  view="magicLink"
                  isPending={isPending}
                  {...props}
                />
              )}
            </Fieldset.Actions>

            {showSeparator && (
              <FieldSeparator>{localization.auth.or}</FieldSeparator>
            )}

            <Description className="flex justify-center gap-1.5 text-foreground text-sm">
              {localization.auth.needToCreateAnAccount}

              <Link
                href={`${basePaths.auth}/${viewPaths.auth.signUp}`}
                className="link link--underline-hover text-accent"
              >
                {localization.auth.signUp}
              </Link>
            </Description>
          </Fieldset>
        </Form>
      </Card.Content>
    </Card>
  )
}
