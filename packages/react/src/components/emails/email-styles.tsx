import colors from "tailwindcss/colors"

export const defaultColors = {
  light: {
    background: colors.neutral[100],
    border: colors.neutral[200],
    card: colors.white,
    cardForeground: colors.neutral[950],
    foreground: colors.neutral[950],
    muted: colors.neutral[100],
    mutedForeground: colors.neutral[500],
    primary: colors.neutral[900],
    primaryForeground: colors.white
  },
  dark: {
    background: colors.neutral[950],
    border: colors.neutral[800],
    card: colors.neutral[900],
    cardForeground: colors.neutral[50],
    foreground: colors.neutral[50],
    muted: colors.neutral[800],
    mutedForeground: colors.neutral[400],
    primary: colors.neutral[100],
    primaryForeground: colors.black
  }
}

export type EmailClassNames = {
  body?: string
  container?: string
  card?: string
  logo?: string
  title?: string
  content?: string
  button?: string
  description?: string
  separator?: string
  link?: string
  poweredBy?: string
}

export type EmailColors = {
  light?: Partial<typeof defaultColors.light>
  dark?: Partial<typeof defaultColors.dark>
}

interface EmailStylesProps {
  colors?: {
    light?: Partial<typeof defaultColors.light>
    dark?: Partial<typeof defaultColors.dark>
  }
  darkMode?: boolean
}

export const EmailStyles = ({ colors, darkMode = true }: EmailStylesProps) => {
  return (
    <style type="text/css">{`
      .bg-background {
        background-color: ${colors?.light?.background || defaultColors.light.background} !important;
      }
      .bg-card {
        background-color: ${colors?.light?.card || defaultColors.light.card} !important;
      }
      .bg-primary {
        background-color: ${colors?.light?.primary || defaultColors.light.primary} !important;
      }
      .bg-muted {
        background-color: ${colors?.light?.muted || defaultColors.light.muted} !important;
      }
      .border-border {
        border-color: ${colors?.light?.border || defaultColors.light.border} !important;
      }
      .text-card-foreground {
        color: ${colors?.light?.cardForeground || defaultColors.light.cardForeground} !important;
      }
      .text-muted-foreground {
        color: ${colors?.light?.mutedForeground || defaultColors.light.mutedForeground} !important;
      }
      .text-primary {
        color: ${colors?.light?.primary || defaultColors.light.primary} !important;
      }
      .text-primary-foreground {
        color: ${colors?.light?.primaryForeground || defaultColors.light.primaryForeground} !important;
      }
      .logo-dark {
        display: none !important;
      }
      .logo-light {
        display: block !important;
      }

      ${
        darkMode
          ? `@media (prefers-color-scheme: dark) {
        .bg-background {
          background-color: ${colors?.dark?.background || defaultColors.dark.background} !important;
        }
        .bg-card {
          background-color: ${colors?.dark?.card || defaultColors.dark.card} !important;
        }
        .bg-primary {
          background-color: ${colors?.dark?.primary || defaultColors.dark.primary} !important;
        }
        .bg-muted {
          background-color: ${colors?.dark?.muted || defaultColors.dark.muted} !important;
        }
        .border-border {
          border-color: ${colors?.dark?.border || defaultColors.dark.border} !important;
        }
        .text-card-foreground {
          color: ${colors?.dark?.cardForeground || defaultColors.dark.cardForeground} !important;
        }
        .text-muted-foreground {
          color: ${colors?.dark?.mutedForeground || defaultColors.dark.mutedForeground} !important;
        }
        .text-primary {
          color: ${colors?.dark?.primary || defaultColors.dark.primary} !important;
        }
        .text-primary-foreground {
          color: ${colors?.dark?.primaryForeground || defaultColors.dark.primaryForeground} !important;
        }
        .logo-dark {
          display: block !important;
        }
        .logo-light {
          display: none !important;
        }
        * {
          box-shadow: none !important;
        }
      }`
          : ""
      }
    `}</style>
  )
}
