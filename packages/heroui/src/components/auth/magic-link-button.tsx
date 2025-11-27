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
  isPending: boolean
  localization?: Partial<MagicLinkButtonLocalization>
  view?: AuthView
}

/**
 * Render a full-width tertiary button that links to either the magic-link or sign-in route and displays the corresponding icon and label.
 *
 * The component merges provided localization overrides with built-in defaults. When `isPending` is true, the button receives disabled styling and prevents pointer interactions.
 *
 * @param isPending - If true, apply disabled styling and prevent interactions
 * @param view - Current auth view; when `"magicLink"`, the button shows the password/sign-in variant
 * @param props - Additional props; supported property `localization` can provide partial overrides for button text
 * @returns A link-styled button element that navigates to the appropriate auth route and shows the matching icon and text
 */
export function MagicLinkButton({
  isPending,
  view,
  ...props
}: MagicLinkButtonProps) {
  const localization = {
    ...MagicLinkButton.localization,
    ...props.localization
  }

  const { basePaths, viewPaths, Link } = useAuth()

  const isMagicLinkView = view === "magicLink"

  return (
    <Link
      href={`${basePaths.auth}/${isMagicLinkView ? viewPaths.auth.signIn : viewPaths.auth.magicLink}`}
      className={cn(
        "button button--tertiary w-full",
        isPending && "status-disabled pointer-events-none"
      )}
    >
      {isMagicLinkView ? <LockClosedIcon /> : <EnvelopeIcon />}

      {isMagicLinkView
        ? localization.CONTINUE_WITH_PASSWORD
        : localization.CONTINUE_WITH_MAGIC_LINK}
    </Link>
  )
}

MagicLinkButton.localization = localization