import type { ReactNode } from "react"
import { DemoProviders } from "@/components/demo-providers"

export default function Layout({ children }: { children: ReactNode }) {
  return <DemoProviders>{children}</DemoProviders>
}
