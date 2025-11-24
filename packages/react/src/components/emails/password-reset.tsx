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

interface PasswordResetEmailProps {
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
  font?: Omit<ComponentProps<typeof Font>, "fallbackFontFamily"> & {
    fallbackFontFamily?: ComponentProps<typeof Font>["fallbackFontFamily"]
  }
}

export const PasswordResetEmail = ({
  url,
  email,
  appName,
  expirationMinutes = 60,
  logoURL = "https://better-auth.com/logo.png",
  colors,
  classNames,
  darkMode = true,
  poweredBy = true,
  head,
  font
}: PasswordResetEmailProps) => {
  const previewText = "Reset your password"

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
                    className={cn(
                      "hidden mx-auto mb-8 logo-dark",
                      classNames?.logo
                    )}
                  />
                </>
              )}

              <Heading
                className={cn(
                  "m-0 mb-5 text-2xl font-semibold",
                  classNames?.title
                )}
              >
                Reset your password
              </Heading>

              <Text className={cn("text-sm font-normal", classNames?.content)}>
                We received a request to reset the password for your account
                {email && (
                  <>
                    {" "}
                    <Link
                      href={`mailto:${email}`}
                      className="text-primary font-medium"
                    >
                      {email}
                    </Link>
                  </>
                )}
                .
              </Text>

              <Section className="my-6">
                <Button
                  href={url}
                  className={cn(
                    "inline-block whitespace-nowrap rounded-none text-sm font-medium py-2.5 px-6 bg-primary text-primary-foreground no-underline",
                    classNames?.button
                  )}
                >
                  Reset password
                </Button>
              </Section>

              <Text
                className={cn(
                  "m-0 mb-3 text-xs text-muted-foreground",
                  classNames?.description
                )}
              >
                Or copy and paste this URL into your browser:
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

              <Text
                className={cn(
                  "m-0 mb-3 text-xs text-muted-foreground",
                  classNames?.description
                )}
              >
                This link expires in {expirationMinutes} minutes.
                {appName && <> Email sent by {appName}.</>}
              </Text>

              <Text
                className={cn(
                  "m-0 text-xs text-muted-foreground",
                  classNames?.description
                )}
              >
                If you didn't request a password reset, you can safely ignore
                this email. Your password will remain unchanged.
              </Text>

              {poweredBy && (
                <Text
                  className={cn(
                    "m-0 mt-4 text-center text-[11px] text-muted-foreground",
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

PasswordResetEmail.PreviewProps = {
  url: "https://better-auth-ui.com/auth/reset-password?token=example-token",
  email: "m@example.com",
  appName: "Better Auth",
  darkMode: true
} as PasswordResetEmailProps

export default PasswordResetEmail
