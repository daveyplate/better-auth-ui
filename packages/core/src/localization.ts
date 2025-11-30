import { authLocalization } from "./localization/auth"

export const localization = {
  auth: authLocalization
}

export type Localization = typeof localization

export * from "./localization/auth"
