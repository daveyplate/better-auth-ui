import EmailChangedEmail from "./email-changed"
import EmailVerificationEmail from "./email-verification"
import MagicLinkEmail from "./magic-link"
import NewDeviceEmail from "./new-device"
import OtpEmail from "./otp-email"
import PasswordChangedEmail from "./password-changed"
import PasswordResetEmail from "./password-reset"

export const emailLocalization = {
  ...EmailChangedEmail.localization,
  ...EmailVerificationEmail.localization,
  ...MagicLinkEmail.localization,
  ...NewDeviceEmail.localization,
  ...OtpEmail.localization,
  ...PasswordChangedEmail.localization,
  ...PasswordResetEmail.localization
}

export type EmailLocalization = typeof emailLocalization
