"use client"

import { AuthProvider } from "@better-auth-ui/heroui"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"

import { authClient } from "@/lib/auth-client"

/**
 * Wraps descendants with theme and authentication providers for the application.
 *
 * @param children - React nodes to render inside the providers
 * @returns The provider tree (ThemeProvider > AuthProvider) that wraps `children`
 */
export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()

  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      <AuthProvider
        authClient={authClient}
        navigate={router.push}
        replace={router.replace}
        Link={Link}
      >
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}