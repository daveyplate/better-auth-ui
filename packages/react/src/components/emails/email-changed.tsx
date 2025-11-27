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

const emailChangedEmailLocalization = {
  YOUR_EMAIL_ADDRESS_HAS_BEEN_CHANGED: "Your email address has been changed",
  LOGO: "Logo",
  EMAIL_ADDRESS_CHANGED: "Email address changed",
  EMAIL_ADDRESS_FOR_YOUR_ACCOUNT_CHANGED:
    "The email address for your {appName} account has been changed.",
  PREVIOUS_EMAIL: "Previous email:",
  NEW_EMAIL: "New email:",
  IF_YOU_MADE_THIS_CHANGE:
    "If you made this change, you can safely ignore this email.",
  I_DIDNT_MAKE_THIS_CHANGE: "I didn't make this change",
  EMAIL_SENT_BY: "Email sent by {appName}.",
  IF_YOU_DIDNT_AUTHORIZE_THIS_CHANGE:
    "If you didn't authorize this change, please contact support immediately {supportEmail} to secure your account.",
  POWERED_BY_BETTER_AUTH: "Powered by {betterAuth}"
}

export type EmailChangedEmailLocalization = typeof emailChangedEmailLocalization

interface EmailChangedEmailProps {
  oldEmail?: string
  newEmail?: string
  revertURL?: string
  appName?: string
  supportEmail?: string
  logoURL?: string | { light: string; dark: string }
  classNames?: EmailClassNames
  colors?: EmailColors
  poweredBy?: boolean
  darkMode?: boolean
  head?: ReactNode
  localization?: Partial<EmailChangedEmailLocalization>
}

export const EmailChangedEmail = ({
  oldEmail,
  newEmail,
  revertURL,
  appName,
  supportEmail,
  logoURL = "https://better-auth.com/logo.png",
  colors,
  classNames,
  darkMode = true,
  poweredBy,
  head,
  ...props
}: EmailChangedEmailProps) => {
  const localization = {
    ...EmailChangedEmail.localization,
    ...props.localization
  }

  const previewText = localization.YOUR_EMAIL_ADDRESS_HAS_BEEN_CHANGED

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
                {localization.EMAIL_ADDRESS_CHANGED}
              </Heading>

              <Text className={cn("text-sm font-normal", classNames?.content)}>
                {localization.EMAIL_ADDRESS_FOR_YOUR_ACCOUNT_CHANGED.replace(
                  "{appName}",
                  appName || ""
                )
                  .replace(/\s{2,}/g, " ")
                  .replace(" .", ".")}
              </Text>

              {(oldEmail || newEmail) && (
                <Section
                  className={cn(
                    "my-6 border border-border bg-muted p-4",
                    classNames?.codeBlock
                  )}
                >
                  {oldEmail && (
                    <>
                      <Text
                        className={cn(
                          "m-0 mb-2 text-xs text-muted-foreground",
                          classNames?.description
                        )}
                      >
                        {localization.PREVIOUS_EMAIL}
                      </Text>

                      <Text
                        className={cn(
                          "m-0 mb-4 text-sm font-semibold",
                          classNames?.content
                        )}
                      >
                        {oldEmail}
                      </Text>
                    </>
                  )}

                  {newEmail && (
                    <>
                      <Text
                        className={cn(
                          "m-0 mb-2 text-xs text-muted-foreground",
                          classNames?.description
                        )}
                      >
                        {localization.NEW_EMAIL}
                      </Text>

                      <Text
                        className={cn(
                          "m-0 text-sm font-semibold text-primary",
                          classNames?.content
                        )}
                      >
                        {newEmail}
                      </Text>
                    </>
                  )}
                </Section>
              )}

              <Text className={cn("text-sm font-normal", classNames?.content)}>
                {localization.IF_YOU_MADE_THIS_CHANGE}
              </Text>

              {revertURL && (
                <Section className="my-6">
                  <Button
                    href={revertURL}
                    className={cn(
                      "inline-block whitespace-nowrap rounded-none text-sm font-medium py-2.5 px-6 bg-primary text-primary-foreground no-underline",
                      classNames?.button
                    )}
                  >
                    {localization.I_DIDNT_MAKE_THIS_CHANGE}
                  </Button>
                </Section>
              )}

              <Hr
                className={cn(
                  "my-6 w-full border border-solid border-border",
                  classNames?.separator
                )}
              />

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
                {(() => {
                  const [beforeSupportEmail, afterSupportEmail] =
                    localization.IF_YOU_DIDNT_AUTHORIZE_THIS_CHANGE.split(
                      "{supportEmail}"
                    )

                  return supportEmail ? (
                    <>
                      {beforeSupportEmail}
                      <Link
                        href={`mailto:${supportEmail}`}
                        className={cn(
                          "text-primary underline",
                          classNames?.link
                        )}
                      >
                        {supportEmail}
                      </Link>
                      {afterSupportEmail}
                    </>
                  ) : (
                    localization.IF_YOU_DIDNT_AUTHORIZE_THIS_CHANGE.replace(
                      "{supportEmail}",
                      ""
                    )
                      .replace(/\s{2,}/g, " ")
                      .replace(" .", ".")
                  )
                })()}
              </Text>

              {poweredBy && (
                <Text
                  className={cn(
                    "mt-4 mb-0 text-center text-[11px] text-muted-foreground",
                    classNames?.poweredBy
                  )}
                >
                  {(() => {
                    const [beforeBetterAuth, afterBetterAuth] =
                      localization.POWERED_BY_BETTER_AUTH.split("{betterAuth}")

                    return (
                      <>
                        {beforeBetterAuth}
                        <Link
                          href="https://better-auth.com"
                          className={cn(
                            "text-primary underline",
                            classNames?.link
                          )}
                        >
                          better-auth
                        </Link>
                        {afterBetterAuth}
                      </>
                    )
                  })()}
                </Text>
              )}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

EmailChangedEmail.localization = emailChangedEmailLocalization

EmailChangedEmail.PreviewProps = {
  oldEmail: "old@example.com",
  newEmail: "new@example.com",
  supportEmail: "support@example.com",
  revertURL: "https://better-auth-ui.com/auth/revert-email?token=example-token",
  appName: "Better Auth",
  poweredBy: true,
  darkMode: true
} as EmailChangedEmailProps

export default EmailChangedEmail
