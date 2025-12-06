import type { ReactNode } from "react"

import "@/styles/shadcn.css"

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
