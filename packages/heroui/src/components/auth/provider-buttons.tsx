"use client"

import { getProviderName } from "@better-auth-ui/core"
import { providerIcons } from "@better-auth-ui/react"
import { Button } from "@heroui/react"
import type { SocialProvider } from "better-auth/social-providers"

export const providerButtonsLocalization = {
  CONTINUE_WITH_PROVIDER: "Continue with {provider}"
}

export type ProviderButtonsLocalization = typeof providerButtonsLocalization

export type ProviderButtonsProps = {
  providers: SocialProvider[]
  isPending: boolean
  setIsPending: (pending: boolean) => void
  localization?: Partial<ProviderButtonsLocalization>
}

export function ProviderButtons({
  providers,
  isPending,
  setIsPending,
  localization
}: ProviderButtonsProps) {
  localization = { ...providerButtonsLocalization, ...localization }

  const handleClick = async (provider: SocialProvider) => {
    setIsPending(true)
    console.log("clicked", provider)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsPending(false)
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
