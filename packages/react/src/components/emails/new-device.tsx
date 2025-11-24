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

interface DeviceInfo {
  browser?: string
  os?: string
  location?: string
  ipAddress?: string
  timestamp?: string
}

interface NewDeviceEmailProps {
  userEmail?: string
  deviceInfo?: DeviceInfo
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

export const NewDeviceEmail = ({
  userEmail,
  deviceInfo,
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
}: NewDeviceEmailProps) => {
  const previewText = "New sign-in detected"

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
                New sign-in detected
              </Heading>

              <Text className={cn("text-sm font-normal", classNames?.content)}>
                We detected a new sign-in to your {appName || ""} account
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
                from a device we don't recognize.
              </Text>

              {deviceInfo && (
                <Section
                  className={cn(
                    "my-6 border border-border p-4 bg-muted",
                    classNames?.card
                  )}
                >
                  <Text
                    className={cn(
                      "m-0 mb-3 text-xs text-muted-foreground",
                      classNames?.description
                    )}
                  >
                    Device details:
                  </Text>

                  {deviceInfo.browser && (
                    <Text
                      className={cn("m-0 mb-2 text-sm", classNames?.content)}
                    >
                      <span className="font-semibold">Browser:</span>{" "}
                      {deviceInfo.browser}
                    </Text>
                  )}

                  {deviceInfo.os && (
                    <Text
                      className={cn("m-0 mb-2 text-sm", classNames?.content)}
                    >
                      <span className="font-semibold">Operating System:</span>{" "}
                      {deviceInfo.os}
                    </Text>
                  )}

                  {deviceInfo.location && (
                    <Text
                      className={cn("m-0 mb-2 text-sm", classNames?.content)}
                    >
                      <span className="font-semibold">Location:</span>{" "}
                      {deviceInfo.location}
                    </Text>
                  )}

                  {deviceInfo.ipAddress && (
                    <Text
                      className={cn("m-0 mb-2 text-sm", classNames?.content)}
                    >
                      <span className="font-semibold">IP Address:</span>{" "}
                      {deviceInfo.ipAddress}
                    </Text>
                  )}

                  {deviceInfo.timestamp && (
                    <Text className={cn("m-0 text-sm", classNames?.content)}>
                      <span className="font-semibold">Time:</span>{" "}
                      {deviceInfo.timestamp}
                    </Text>
                  )}
                </Section>
              )}

              <Text className={cn("text-sm font-normal", classNames?.content)}>
                If this was you, you can safely ignore this email. If you don't
                recognize this activity, please secure your account immediately.
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
                    Secure my account
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
                  If you didn't sign in, please contact support immediately at{" "}
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

NewDeviceEmail.PreviewProps = {
  userEmail: "m@example.com",
  deviceInfo: {
    browser: "Chrome on macOS",
    os: "macOS 26.2",
    location: "San Francisco, CA, United States",
    ipAddress: "127.0.0.1",
    timestamp: "February 10, 2026 at 4:20 PM UTC"
  },
  secureAccountLink: "https://better-auth-ui.com/auth/secure-account",
  appName: "Better Auth",
  supportEmail: "support@example.com",
  darkMode: true
} as NewDeviceEmailProps

export default NewDeviceEmail
