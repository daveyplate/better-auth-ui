import type { AuthView } from "@better-auth-ui/core"
import type { AnyAuthConfig } from "@better-auth-ui/react"
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline"
import { useAuth } from "../../hooks/use-auth"
import { cn } from "../../lib/utils"

export type MagicLinkButtonProps = AnyAuthConfig & {
  isPending: boolean
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
  const { basePaths, viewPaths, localization, Link } = useAuth(props)

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
        ? localization.auth.continueWith.replace(
            "{{provider}}",
            localization.auth.password
          )
        : localization.auth.continueWith.replace(
            "{{provider}}",
            localization.auth.magicLink
          )}
    </Link>
  )
}
