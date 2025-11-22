"use client"

import type { AuthView } from "@better-auth-ui/core"
import { cn, useAuthConfig } from "@better-auth-ui/react"
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline"

export type MagicLinkButtonProps = {
  view?: AuthView
  isPending: boolean
}

export function MagicLinkButton({ view, isPending }: MagicLinkButtonProps) {
  const { Link } = useAuthConfig()

  const isMagicLinkView = view === "magic-link"
  const Icon = isMagicLinkView ? LockClosedIcon : EnvelopeIcon
  const text = isMagicLinkView
    ? "Continue with Password"
    : "Continue with Magic Link"

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
