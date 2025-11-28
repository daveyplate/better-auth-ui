"use client"

import { getProviderName } from "@better-auth-ui/core"
import {
  type AuthConfig,
  cn,
  providerIcons,
  useAuth
} from "@better-auth-ui/react"
import { Button } from "@heroui/react"
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
    if (!socialProviders?.length) {
      return socialLayout
    }

    if (socialLayout === "auto") {
      if (socialProviders.length === 1) {
        return "horizontal"
      }
      if (socialProviders.length === 2) {
        return "grid"
      }
      if (socialProviders.length === 3) {
        return "vertical"
      }
      if (socialProviders.length === 4) {
        return "horizontal"
      }

      // if it's odd, return vertical
      if (socialProviders.length % 2 !== 0) {
        return "vertical"
      }

      return "grid"
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
    <div
      className={cn(
        "gap-4",
        resolvedSocialLayout === "vertical" && "flex flex-col",
        resolvedSocialLayout === "horizontal" && "flex flex-row",
        resolvedSocialLayout === "grid" && "grid grid-cols-2"
      )}
    >
      {socialProviders?.map((provider) => {
        const ProviderIcon = providerIcons[provider]

        return (
          <Button
            key={provider}
            className="w-full"
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
    </div>
  )
}

ProviderButtons.localization = providerButtonsLocalization
