"use client"

import { getProviderName } from "@better-auth-ui/core"
import {
  type AuthConfig,
  cn,
  providerIcons,
  useAuth
} from "@better-auth-ui/react"
import { Button, Fieldset } from "@heroui/react"
import type { DeepPartial } from "better-auth/client/plugins"
import { useMemo } from "react"
import { toast } from "sonner"

const providerButtonsLocalization = {
  CONTINUE_WITH_PROVIDER: "Continue with {provider}"
}

export type ProviderButtonsLocalization = typeof providerButtonsLocalization

export type ProviderButtonsProps = DeepPartial<AuthConfig> & {
  isPending: boolean
  localization?: Partial<ProviderButtonsLocalization>
  setIsPending: (pending: boolean) => void
  socialLayout?: SocialLayout
}

export type SocialLayout = "auto" | "horizontal" | "vertical" | "grid"

/**
 * Render social provider sign-in buttons and handle sign-in initiation and pending state.
 *
 * @param isPending - When true, disables all provider buttons.
 * @param setIsPending - Callback to update the pending state while a sign-in request is in progress.
 * @param socialLayout - Preferred layout for the provider buttons; when set to `"auto"` the layout is chosen based on the number of available providers.
 * @returns A JSX element containing the configured social provider buttons (icons and optional labels) with click handlers that start social sign-in.
 */
export function ProviderButtons({
  isPending,
  setIsPending,
  socialLayout = "auto",
  ...props
}: ProviderButtonsProps) {
  const localization = {
    ...ProviderButtons.localization,
    ...props.localization
  }

  const { authClient, baseURL, redirectTo, socialProviders } = useAuth(props)

  const resolvedSocialLayout = useMemo(() => {
    if (socialLayout === "auto") {
      if (socialProviders?.length && socialProviders.length >= 4) {
        return "horizontal"
      }

      return "vertical"
    }

    return socialLayout
  }, [socialLayout, socialProviders?.length])

  const handleClick = async (provider: string) => {
    setIsPending(true)

    const callbackURL = `${baseURL}${redirectTo}`

    const { error } = await authClient.signIn.social({
      provider,
      callbackURL
    })

    setIsPending(false)

    if (error) {
      toast.error(error.message)
      return
    }
  }

  return (
    <Fieldset.Actions
      className={cn(
        "gap-3",
        resolvedSocialLayout === "grid" && "grid grid-cols-2",
        resolvedSocialLayout === "vertical" && "flex-col",
        resolvedSocialLayout === "horizontal" && "flex-wrap"
      )}
    >
      {socialProviders?.map((provider) => {
        const ProviderIcon = providerIcons[provider]

        return (
          <Button
            key={provider}
            className={cn(
              "w-full",
              resolvedSocialLayout === "horizontal" && "flex-1"
            )}
            variant="tertiary"
            type="button"
            isDisabled={isPending}
            onClick={() => handleClick(provider)}
          >
            <ProviderIcon />

            {resolvedSocialLayout === "vertical"
              ? localization.CONTINUE_WITH_PROVIDER.replace(
                  "{provider}",
                  getProviderName(provider)
                )
              : resolvedSocialLayout === "grid"
                ? getProviderName(provider)
                : null}
          </Button>
        )
      })}
    </Fieldset.Actions>
  )
}

ProviderButtons.localization = providerButtonsLocalization
