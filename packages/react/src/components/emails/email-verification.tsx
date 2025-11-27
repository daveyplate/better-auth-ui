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

const emailVerificationEmailLocalization = {
  VERIFY_YOUR_EMAIL_ADDRESS: "Verify your email address",
  LOGO: "Logo",
  CLICK_BUTTON_TO_VERIFY_EMAIL:
    "Click the button below to verify your email address {emailAddress} for your {appName} account.",
  VERIFY_EMAIL_ADDRESS: "Verify email address",
  OR_COPY_AND_PASTE_URL: "Or copy and paste this URL into your browser:",
  THIS_LINK_EXPIRES_IN_MINUTES:
    "This link expires in {expirationMinutes} minutes.",
  EMAIL_SENT_BY: "Email sent by {appName}.",
  IF_YOU_DIDNT_REQUEST_THIS_EMAIL:
    "If you didn't request this email, you can safely ignore it. Someone else might have typed your email address by mistake.",
  POWERED_BY_BETTER_AUTH: "Powered by {betterAuth}"
}

export type EmailVerificationEmailLocalization =
  typeof emailVerificationEmailLocalization

export interface EmailVerificationEmailProps {
  url: string
  email?: string
  appName?: string
  expirationMinutes?: number
  logoURL?: string | { light: string; dark: string }
  classNames?: EmailClassNames
  colors?: EmailColors
  poweredBy?: boolean
  darkMode?: boolean
  head?: ReactNode
  localization?: Partial<EmailVerificationEmailLocalization>
}

export const EmailVerificationEmail = ({
  url,
  email,
  appName,
  expirationMinutes = 60,
  logoURL = "https://better-auth.com/logo.png",
  colors,
  classNames,
  darkMode = true,
  poweredBy,
  head,
  ...props
}: EmailVerificationEmailProps) => {
  const localization = {
    ...EmailVerificationEmail.localization,
    ...props.localization
  }

  const previewText = localization.VERIFY_YOUR_EMAIL_ADDRESS

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
                {localization.VERIFY_EMAIL_ADDRESS}
              </Heading>

              <Text className={cn("text-sm font-normal", classNames?.content)}>
                {(() => {
                  const textWithAppName =
                    localization.CLICK_BUTTON_TO_VERIFY_EMAIL.replace(
                      "{appName}",
                      appName || ""
                    )
                      .replace(/\s{2,}/g, " ")
                      .replace(" .", ".")

                  const [beforeEmailAddress, afterEmailAddress] =
                    textWithAppName.split("{emailAddress}")

                  return email ? (
                    <>
                      {beforeEmailAddress}

                      <Link
                        href={`mailto:${email}`}
                        className="text-primary font-medium"
                      >
                        {email}
                      </Link>

                      {afterEmailAddress}
                    </>
                  ) : (
                    textWithAppName
                      .replace("{emailAddress}", "")
                      .replace(/\s{2,}/g, " ")
                      .replace(" .", ".")
                  )
                })()}
              </Text>

              <Section className="my-6">
                <Button
                  href={url}
                  className={cn(
                    "inline-block whitespace-nowrap rounded-none text-sm font-medium py-2.5 px-6 bg-primary text-primary-foreground no-underline",
                    classNames?.button
                  )}
                >
                  {localization.VERIFY_EMAIL_ADDRESS}
                </Button>
              </Section>

              <Text
                className={cn(
                  "mb-3 text-xs text-muted-foreground",
                  classNames?.description
                )}
              >
                {localization.OR_COPY_AND_PASTE_URL}
              </Text>

              <Link
                className={cn(
                  "break-all text-xs text-primary",
                  classNames?.link
                )}
                href={url}
              >
                {url}
              </Link>

              <Hr
                className={cn(
                  "my-6 w-full border border-solid border-border",
                  classNames?.separator
                )}
              />

              {expirationMinutes || appName ? (
                <Text
                  className={cn(
                    "mb-3 text-xs text-muted-foreground",
                    classNames?.description
                  )}
                >
                  {expirationMinutes
                    ? localization.THIS_LINK_EXPIRES_IN_MINUTES.replace(
                        "{expirationMinutes}",
                        expirationMinutes.toString()
                      )
                    : null}

                  {appName && (
                    <>
                      {expirationMinutes ? " " : ""}
                      {localization.EMAIL_SENT_BY.replace("{appName}", appName)}
                    </>
                  )}
                </Text>
              ) : null}

              <Text
                className={cn(
                  "mt-3 text-xs text-muted-foreground",
                  classNames?.description
                )}
              >
                {localization.IF_YOU_DIDNT_REQUEST_THIS_EMAIL}
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

EmailVerificationEmail.localization = emailVerificationEmailLocalization

EmailVerificationEmail.PreviewProps = {
  url: "https://better-auth-ui.com/auth/verify-email?token=example-token",
  appName: "Better Auth",
  email: "m@example.com",
  darkMode: true
} as EmailVerificationEmailProps

export default EmailVerificationEmail
