import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  pixelBasedPreset,
  Section,
  Tailwind,
  Text
} from "@react-email/components"
import type { ReactNode } from "react"

import { cn } from "../../lib/utils"
import {
  type EmailClassNames,
  type EmailColors,
  EmailStyles
} from "./email-styles"

const localization = {
  YOUR_PASSWORD_HAS_BEEN_CHANGED: "Your password has been changed",
  LOGO: "Logo",
  PASSWORD_CHANGED_SUCCESSFULLY: "Password changed successfully",
  PASSWORD_FOR_YOUR_ACCOUNT_CHANGED:
    "The password for your {appName} account {userEmail} has been changed successfully.",
  CHANGED_AT: "Changed at",
  IF_YOU_MADE_THIS_CHANGE:
    "If you made this change, you can safely ignore this email. Your account is secure.",
  I_DIDNT_MAKE_THIS_CHANGE: "I didn't make this change",
  EMAIL_SENT_BY: "Email sent by {appName}.",
  IF_YOU_DIDNT_AUTHORIZE_THIS_CHANGE:
    "If you didn't authorize this change, please contact support immediately {supportEmail} to secure your account.",
  POWERED_BY_BETTER_AUTH: "Powered by {betterAuth}"
}

export type PasswordChangedEmailLocalization = typeof localization

interface PasswordChangedEmailProps {
  userEmail?: string
  timestamp?: string
  secureAccountLink?: string
  appName?: string
  supportEmail?: string
  logoURL?: string | { light: string; dark: string }
  classNames?: EmailClassNames
  colors?: EmailColors
  poweredBy?: boolean
  darkMode?: boolean
  head?: ReactNode
  localization?: Partial<PasswordChangedEmailLocalization>
}

export const PasswordChangedEmail = ({
  userEmail,
  timestamp,
  secureAccountLink,
  appName,
  supportEmail,
  logoURL = "https://better-auth.com/logo.png",
  colors,
  classNames,
  darkMode = true,
  poweredBy,
  head,
  ...props
}: PasswordChangedEmailProps) => {
  const localization = {
    ...PasswordChangedEmail.localization,
    ...props.localization
  }

  const previewText = localization.YOUR_PASSWORD_HAS_BEEN_CHANGED

  return (
    <Html>
      <Head>
        <meta content="light dark" name="color-scheme" />
        <meta content="light dark" name="supported-color-schemes" />

        <EmailStyles colors={colors} darkMode={darkMode} />

        {head}
      </Head>

      <Preview>{previewText}</Preview>

      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Body className={cn("bg-background font-sans", classNames?.body)}>
          <Container
            className={cn(
              "mx-auto my-auto max-w-xl px-2 py-10",
              classNames?.container
            )}
          >
            <Section
              className={cn(
                "bg-card text-card-foreground rounded-none border border-border p-8",
                classNames?.card
              )}
            >
              {logoURL &&
                (typeof logoURL === "string" ? (
                  <Img
                    src={logoURL}
                    width={48}
                    height={48}
                    alt={appName || localization.LOGO}
                    className={cn("mx-auto mb-8", classNames?.logo)}
                  />
                ) : (
                  <>
                    <Img
                      src={logoURL.light}
                      width={48}
                      height={48}
                      alt={appName || localization.LOGO}
                      className={cn(
                        "mx-auto mb-8 logo-light",
                        classNames?.logo
                      )}
                    />
                    <Img
                      src={logoURL.dark}
                      width={48}
                      height={48}
                      alt={appName || localization.LOGO}
                      className={cn(
                        "hidden mx-auto mb-8 logo-dark",
                        classNames?.logo
                      )}
                    />
                  </>
                ))}

              <Heading
                className={cn(
                  "m-0 mb-5 text-2xl font-semibold",
                  classNames?.title
                )}
              >
                {localization.PASSWORD_CHANGED_SUCCESSFULLY}
              </Heading>

              <Text className={cn("text-sm font-normal", classNames?.content)}>
                {(() => {
                  const textWithAppName =
                    localization.PASSWORD_FOR_YOUR_ACCOUNT_CHANGED.replace(
                      "{appName}",
                      appName || ""
                    ).replace(" .", ".")

                  return userEmail ? (
                    <>
                      {textWithAppName.split("{userEmail}")[0]}

                      <Link
                        href={`mailto:${userEmail}`}
                        className="text-primary font-medium"
                      >
                        {userEmail}
                      </Link>

                      {textWithAppName.split("{userEmail}")[1]}
                    </>
                  ) : (
                    textWithAppName
                      .replace("{userEmail}", "")
                      .replace(" .", ".")
                  )
                })()}
              </Text>

              {timestamp && (
                <Section
                  className={cn(
                    "my-6 border border-border bg-muted p-4",
                    classNames?.codeBlock
                  )}
                >
                  <Text
                    className={cn(
                      "m-0 mb-2 text-xs text-muted-foreground",
                      classNames?.description
                    )}
                  >
                    {localization.CHANGED_AT}:
                  </Text>
                  <Text
                    className={cn(
                      "m-0 text-sm font-semibold",
                      classNames?.content
                    )}
                  >
                    {timestamp}
                  </Text>
                </Section>
              )}

              <Text className={cn("text-sm font-normal", classNames?.content)}>
                {localization.IF_YOU_MADE_THIS_CHANGE}
              </Text>

              {secureAccountLink && (
                <Section className="mt-6">
                  <Button
                    href={secureAccountLink}
                    className={cn(
                      "inline-block whitespace-nowrap rounded-none text-sm font-medium py-2.5 px-6 bg-primary text-primary-foreground no-underline",
                      classNames?.button
                    )}
                  >
                    {localization.I_DIDNT_MAKE_THIS_CHANGE}
                  </Button>
                </Section>
              )}

              {(appName || poweredBy || supportEmail) && (
                <Hr
                  className={cn(
                    "my-6 w-full border border-solid border-border",
                    classNames?.separator
                  )}
                />
              )}

              {appName && (
                <Text
                  className={cn(
                    "mb-3 text-xs text-muted-foreground",
                    classNames?.description
                  )}
                >
                  {localization.EMAIL_SENT_BY.replace("{appName}", appName)}
                </Text>
              )}

              <Text
                className={cn(
                  "mt-3 text-xs text-muted-foreground",
                  classNames?.description
                )}
              >
                {supportEmail ? (
                  <>
                    {
                      localization.IF_YOU_DIDNT_AUTHORIZE_THIS_CHANGE.split(
                        "{supportEmail}"
                      )[0]
                    }
                    <Link
                      href={`mailto:${supportEmail}`}
                      className={cn("text-primary underline", classNames?.link)}
                    >
                      {supportEmail}
                    </Link>
                    {
                      localization.IF_YOU_DIDNT_AUTHORIZE_THIS_CHANGE.split(
                        "{supportEmail}"
                      )[1]
                    }
                  </>
                ) : (
                  localization.IF_YOU_DIDNT_AUTHORIZE_THIS_CHANGE.replace(
                    "{supportEmail}",
                    ""
                  ).replace(" .", ".")
                )}
              </Text>

              {poweredBy && (
                <Text
                  className={cn(
                    "mt-4 mb-0 text-center text-[11px] text-muted-foreground",
                    classNames?.poweredBy
                  )}
                >
                  {localization.POWERED_BY_BETTER_AUTH.split("{betterAuth}")[0]}
                  <Link
                    href="https://better-auth.com"
                    className={cn("text-primary underline", classNames?.link)}
                  >
                    better-auth
                  </Link>
                  {localization.POWERED_BY_BETTER_AUTH.split("{betterAuth}")[1]}
                </Text>
              )}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

PasswordChangedEmail.localization = localization

PasswordChangedEmail.PreviewProps = {
  userEmail: "m@example.com",
  timestamp: "February 10, 2026 at 4:20 PM UTC",
  secureAccountLink: "https://better-auth-ui.com/auth/secure-account",
  appName: "Better Auth",
  supportEmail: "support@example.com",
  darkMode: true
} as PasswordChangedEmailProps

export default PasswordChangedEmail
