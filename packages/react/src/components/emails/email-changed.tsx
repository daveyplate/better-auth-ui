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
  font?: Omit<ComponentProps<typeof Font>, "fallbackFontFamily"> & {
    fallbackFontFamily?: ComponentProps<typeof Font>["fallbackFontFamily"]
  }
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
  poweredBy = true,
  head,
  font
}: EmailChangedEmailProps) => {
  const previewText = "Your email address has been changed"

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
              "mx-auto my-auto max-w-xl w-xl px-2 py-10",
              classNames?.container
            )}
          >
            <Section
              className={cn(
                "bg-card text-card-foreground rounded-none border border-border p-8",
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
                Email address changed
              </Heading>

              <Text className={cn("text-sm font-normal", classNames?.content)}>
                {`The email address for your ${appName || ""} account has been changed.`}
              </Text>

              <Section
                className={cn(
                  "my-6 border border-border p-4 bg-background",
                  classNames?.card
                )}
              >
                <Text
                  className={cn(
                    "m-0 mb-2 text-xs text-muted-foreground",
                    classNames?.description
                  )}
                >
                  Previous email:
                </Text>

                <Text
                  className={cn(
                    "m-0 mb-4 text-sm font-semibold",
                    classNames?.content
                  )}
                >
                  {oldEmail || "old@example.com"}
                </Text>

                <Text
                  className={cn(
                    "m-0 mb-2 text-xs text-muted-foreground",
                    classNames?.description
                  )}
                >
                  New email:
                </Text>

                <Text
                  className={cn(
                    "m-0 text-sm font-semibold text-primary",
                    classNames?.content
                  )}
                >
                  {newEmail || "new@example.com"}
                </Text>
              </Section>

              <Text className={cn("text-sm font-normal", classNames?.content)}>
                If you made this change, you can safely ignore this email.
              </Text>

              {revertURL && (
                <Section className="mt-6">
                  <Button
                    href={revertURL}
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
                  </Link>
                  .
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

EmailChangedEmail.PreviewProps = {
  oldEmail: "old@example.com",
  newEmail: "new@example.com",
  supportEmail: "support@example.com",
  revertURL: "https://better-auth-ui.com/auth/revert-email?token=example-token",
  poweredBy: true,
  darkMode: true
} as EmailChangedEmailProps

export default EmailChangedEmail
