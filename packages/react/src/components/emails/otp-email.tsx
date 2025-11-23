import {
  Body,
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

interface OtpEmailProps {
  verificationCode?: string
  email?: string
  appName?: string
  expirationMinutes?: number
  logoURL?: string | { light: string; dark: string }
  classNames?: EmailClassNames
  colors?: EmailColors
  poweredBy?: boolean
  darkMode?: boolean
  head?: ReactNode
  font?: Partial<ComponentProps<typeof Font>>
}

export const OtpEmail = ({
  verificationCode = "920441",
  email,
  appName,
  expirationMinutes = 10,
  logoURL = "https://better-auth.com/logo.png",
  colors,
  classNames,
  darkMode = true,
  poweredBy = true,
  head,
  font
}: OtpEmailProps) => {
  const previewText = `Your verification code is ${verificationCode}`

  return (
    <Html>
      <Head>
        <meta content="light dark" name="color-scheme" />
        <meta content="light dark" name="supported-color-schemes" />

        <EmailStyles colors={colors} darkMode={darkMode} />

        {font && (
          <Font
            {...font}
            fontFamily={font.fontFamily || "Unknown"}
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
                className={cn("mb-5 text-2xl font-semibold", classNames?.title)}
              >
                Verify your email
              </Heading>

              <Text className={cn("text-sm font-normal", classNames?.content)}>
                We need to verify your email address
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
                )}{" "}
                before you can access your account. Enter the code below in your
                open browser window.
              </Text>

              <Section className="my-6 border border-border bg-muted p-6">
                <Text
                  className={cn(
                    "m-0 text-center text-4xl font-semibold tracking-widest",
                    classNames?.title
                  )}
                >
                  {verificationCode}
                </Text>
              </Section>

              <Hr
                className={cn(
                  "my-6 w-full border border-solid border-border",
                  classNames?.separator
                )}
              />

              <Text
                className={cn(
                  "mb-3 text-xs text-muted-foreground",
                  classNames?.description
                )}
              >
                This code expires in {expirationMinutes} minutes.
                {appName && <> Email sent by {appName}.</>}
              </Text>

              <Text
                className={cn(
                  "mt-3 text-xs text-muted-foreground",
                  classNames?.description
                )}
              >
                If you didn't sign up for {appName || "this service"}, you can
                safely ignore this email. Someone else might have typed your
                email address by mistake.
              </Text>

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

OtpEmail.PreviewProps = {
  verificationCode: "920441",
  email: "daveycodez@gmail.com",
  appName: "Better Auth",
  expirationMinutes: 10,
  darkMode: true,
  font: {
    fontFamily: "Ubuntu",
    webFont: {
      url: "https://cdn.jsdelivr.net/fontsource/fonts/ubuntu-sans:vf@latest/latin-wght-normal.woff2",
      format: "woff2"
    },
    fontWeight: "100 800"
  }
} as OtpEmailProps

export default OtpEmail

