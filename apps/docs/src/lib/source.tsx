import { docs } from "fumadocs-mdx:collections/server"
import { loader } from "fumadocs-core/source"
import * as icons from "lucide-static"
import type { ReactNode } from "react"
import ReactDOMServer from "react-dom/server"
import { HeroUI } from "@/components/icons/heroui"
import { Shadcn } from "@/components/icons/shadcn"

const customIcons: Record<string, ReactNode> = {
  heroui: <HeroUI />,
  shadcn: <Shadcn />
}

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: "/docs",
  icon(icon) {
    if (!icon) {
      return
    }

    if (icon in customIcons)
      return ReactDOMServer.renderToString(customIcons[icon])

    // biome-ignore lint/performance/noDynamicNamespaceImportAccess: Static Icons
    if (icon in icons) return icons[icon as keyof typeof icons]

    return icon
  }
})
