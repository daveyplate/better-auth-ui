import {
  Body,
  Button,
  Container,
  Font,
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
import type { ComponentProps, ReactNode } from "react"

import { cn } from "../../lib/utils"
import {
  type EmailClassNames,
  type EmailColors,
  EmailStyles
} from "./email-styles"

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
  font?: Omit<ComponentProps<typeof Font>, "fallbackFontFamily"> & {
    fallbackFontFamily?: ComponentProps<typeof Font>["fallbackFontFamily"]
  }
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
  poweredBy = true,
  head,
  font
}: PasswordChangedEmailProps) => {
  const previewText = "Your password has been changed"

  return (
    <Html>
      <Head>
        <meta content="light dark" name="color-scheme" />
        <meta content="light dark" name="supported-color-schemes" />

        <EmailStyles colors={colors} darkMode={darkMode} />

        {font && (
          <Font
            {...font}
            fallbackFontFamily={font.fallbackFontFamily || "sans-serif"}
          />
        )}

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
                "bg-card text-card-foreground flex flex-col rounded-none border border-border p-8",
                classNames?.card
              )}
            >
              {typeof logoURL === "string" ? (
                <Img
                  src={logoURL}
                  width={48}
                  height={48}
                  alt={appName || "Logo"}
                  className={cn("mx-auto mb-8", classNames?.logo)}
                />
              ) : (
                <>
                  <Img
                    src={logoURL.light}
                    width={48}
                    height={48}
                    alt={appName || "Logo"}
                    className={cn("mx-auto mb-8 logo-light", classNames?.logo)}
                  />
                  <Img
                    src={logoURL.dark}
                    width={48}
                    height={48}
                    alt={appName || "Logo"}
                    className={cn("mx-auto mb-8 logo-dark", classNames?.logo)}
                  />
                </>
              )}

              <Heading
                className={cn(
                  "m-0 mb-5 text-2xl font-semibold",
                  classNames?.title
                )}
              >
                Password changed successfully
              </Heading>

              <Text className={cn("text-sm font-normal", classNames?.content)}>
                The password for your {appName || ""} account
                {userEmail && (
                  <>
                    {" "}
                    <Link
                      href={`mailto:${userEmail}`}
                      className="text-primary font-medium"
                    >
                      {userEmail}
                    </Link>
                  </>
                )}{" "}
                has been changed successfully.
              </Text>

              {timestamp && (
                <Section
                  className={cn(
                    "my-6 border border-border p-4 bg-muted",
                    classNames?.card
                  )}
                >
                  <Text
                    className={cn(
                      "m-0 mb-2 text-xs text-muted-foreground",
                      classNames?.description
                    )}
                  >
                    Changed at:
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
                If you made this change, you can safely ignore this email. Your
                account is secure.
              </Text>

              {secureAccountLink && (
                <Section className="mt-6">
                  <Button
                    href={secureAccountLink}
                    className={cn(
                      "inline-flex items-center justify-center whitespace-nowrap rounded-none text-sm font-medium h-10 px-6 bg-primary text-primary-foreground no-underline",
                      classNames?.button
                    )}
                  >
                    I didn't make this change
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
                  Email sent by {appName}.
                </Text>
              )}

              {supportEmail && (
                <Text
                  className={cn(
                    "mt-3 text-xs text-muted-foreground",
                    classNames?.description
                  )}
                >
                  If you didn't authorize this change, please contact support
                  immediately at{" "}
                  <Link
                    href={`mailto:${supportEmail}`}
                    className={cn("text-primary underline", classNames?.link)}
                  >
                    {supportEmail}
                  </Link>{" "}
                  to secure your account.
                </Text>
              )}

              {poweredBy && (
                <Text
                  className={cn(
                    "mt-4 mb-0 text-center text-[11px] text-muted-foreground",
                    classNames?.poweredBy
                  )}
                >
                  Powered by{" "}
                  <Link
                    href="https://better-auth.com"
                    className={cn("text-primary underline", classNames?.link)}
                  >
                    better-auth
                  </Link>
                </Text>
              )}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

PasswordChangedEmail.PreviewProps = {
  userEmail: "m@example.com",
  timestamp: "February 10, 2026 at 4:20 PM UTC",
  secureAccountLink: "https://better-auth-ui.com/auth/secure-account",
  appName: "Better Auth",
  supportEmail: "support@example.com",
  darkMode: true
} as PasswordChangedEmailProps

export default PasswordChangedEmail
