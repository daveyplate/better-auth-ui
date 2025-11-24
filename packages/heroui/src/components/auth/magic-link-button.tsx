"use client"

import type { AuthView } from "@better-auth-ui/core"
import { cn, useAuth } from "@better-auth-ui/react"
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline"

const localization = {
  CONTINUE_WITH_MAGIC_LINK: "Continue with Magic Link",
  CONTINUE_WITH_PASSWORD: "Continue with Password"
}

export type MagicLinkButtonLocalization = typeof localization

export type MagicLinkButtonProps = {
  view?: AuthView
  isPending: boolean
  localization?: Partial<MagicLinkButtonLocalization>
}

export function MagicLinkButton({
  view,
  isPending,
  ...props
}: MagicLinkButtonProps) {
  const localization = {
    ...MagicLinkButton.localization,
    ...props.localization
  }

  const { Link } = useAuth()

  const isMagicLinkView = view === "magic-link"
  const Icon = isMagicLinkView ? LockClosedIcon : EnvelopeIcon
  const text = isMagicLinkView
    ? localization.CONTINUE_WITH_PASSWORD
    : localization.CONTINUE_WITH_MAGIC_LINK

  return (
    <Link
      href={`/auth/${isMagicLinkView ? "sign-in" : "magic-link"}`}
      className={cn(
        "button button--tertiary w-full",
        isPending && "status-disabled pointer-events-none"
      )}
    >
      <Icon />
      {text}
    </Link>
  )
}

MagicLinkButton.localization = localization
