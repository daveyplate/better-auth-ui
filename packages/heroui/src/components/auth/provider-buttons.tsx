"use client"

import { getProviderName } from "@better-auth-ui/core"
import { type AuthClient, providerIcons } from "@better-auth-ui/react"
import { Button } from "@heroui/react"
import type { SocialProvider } from "better-auth/social-providers"
import { toast } from "sonner"

const localization = {
  CONTINUE_WITH_PROVIDER: "Continue with {provider}"
}

export type ProviderButtonsLocalization = typeof localization

export type ProviderButtonsProps = {
  providers: SocialProvider[]
  isPending: boolean
  setIsPending: (pending: boolean) => void
  authClient: AuthClient
  localization?: Partial<ProviderButtonsLocalization>
}

export function ProviderButtons({
  providers,
  isPending,
  setIsPending,
  authClient,
  ...props
}: ProviderButtonsProps) {
  const localization = {
    ...ProviderButtons.localization,
    ...props.localization
  }

  const handleClick = async (provider: SocialProvider) => {
    setIsPending(true)

    const { error } = await authClient.signIn.social({
      provider
    })

    if (error) {
      toast.error(error.message || error.status)
      setIsPending(false)
      return
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {providers.map((provider) => {
        const Icon = providerIcons[provider]
        return (
          <Button
            key={provider}
            type="button"
            variant="tertiary"
            className="w-full"
            isDisabled={isPending}
            onClick={() => handleClick(provider)}
          >
            {Icon && <Icon />}
            {localization.CONTINUE_WITH_PROVIDER?.replace(
              "{provider}",
              getProviderName(provider)
            )}
          </Button>
        )
      })}
    </div>
  )
}

ProviderButtons.localization = localization
