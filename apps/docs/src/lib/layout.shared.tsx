import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "Better Auth UI"
    },
    themeSwitch: {
      mode: "light-dark-system"
    },
    githubUrl: "https://github.com/better-auth-ui/better-auth-ui"
  }
}
