import { AuthProvider } from "@better-auth-ui/heroui"
import { Link, useNavigate } from "@tanstack/react-router"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"
import { authClient } from "@/lib/auth-client"

/**
 * Supplies theme and authentication context to its descendants.
 *
 * Wraps `children` with a ThemeProvider configured for system theme support and an
 * AuthProvider wired to the local `authClient` and the app router for navigation and linking.
 *
 * @param children - Components or elements that will receive theme and auth context
 * @returns A React element that renders `children` inside ThemeProvider and AuthProvider
 */
export function Providers({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      <AuthProvider
        authClient={authClient}
        navigate={(path) => navigate({ to: path })}
        replace={(path) => navigate({ to: path, replace: true })}
        Link={({ href, ...props }) => <Link to={href} {...props} />}
      >
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}
