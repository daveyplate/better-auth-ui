"use client"

import { getProviderName } from "@better-auth-ui/core"
import { providerIcons } from "@better-auth-ui/react"
import { Button } from "@heroui/react"
import type { SocialProvider } from "better-auth/social-providers"

export type ProviderButtonsProps = {
  providers: SocialProvider[]
  isPending: boolean
  setIsPending: (pending: boolean) => void
}

export function ProviderButtons({
  providers,
  isPending,
  setIsPending
}: ProviderButtonsProps) {
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
            className="w-full gap-3"
            isDisabled={isPending}
            onClick={() => handleClick(provider)}
          >
            {Icon && <Icon />}
            Continue with {getProviderName(provider)}
          </Button>
        )
      })}
    </div>
  )
}
