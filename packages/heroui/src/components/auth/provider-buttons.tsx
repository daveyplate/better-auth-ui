"use client"

import { getProviderName } from "@better-auth-ui/core"
import { type AuthConfig, providerIcons, useAuth } from "@better-auth-ui/react"
import { Button } from "@heroui/react"
import type { DeepPartial } from "better-auth/client/plugins"
import { toast } from "sonner"

const localization = {
  CONTINUE_WITH_PROVIDER: "Continue with {provider}"
}

export type ProviderButtonsLocalization = typeof localization

export type ProviderButtonsProps = DeepPartial<AuthConfig> & {
  isPending: boolean
  setIsPending: (pending: boolean) => void
  localization?: Partial<ProviderButtonsLocalization>
}

export function ProviderButtons({
  isPending,
  setIsPending,
  ...props
}: ProviderButtonsProps) {
  const localization = {
    ...ProviderButtons.localization,
    ...props.localization
  }

  const { authClient, socialProviders, baseURL, redirectTo } = useAuth(props)

  const handleClick = async (provider: string) => {
    setIsPending(true)

    const callbackURL = `${baseURL}${redirectTo}`

    const { error } = await authClient.signIn.social({
      provider,
      callbackURL
    })

    if (error) {
      toast.error(error.message || error.status)
      setIsPending(false)
      return
    }
  }

  if (!socialProviders || socialProviders.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      {socialProviders.map((provider) => {
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
