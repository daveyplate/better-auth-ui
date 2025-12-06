import { docs } from "fumadocs-mdx:collections/server"
import { type InferPageType, loader } from "fumadocs-core/source"
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons"
import { createElement, type ElementType } from "react"
import { HeroUI } from "@/components/icons/heroui"
import { Shadcn } from "@/components/icons/shadcn"

const customIcons: Record<string, ElementType> = {
  heroui: HeroUI,
  shadcn: Shadcn
}

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
  icon(icon) {
    if (!icon) {
      return
    }

    if (icon in customIcons) return createElement(customIcons[icon])

    return icon
  }
})

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, "image.png"]

  return {
    segments,
    url: `/og/docs/${segments.join("/")}`
  }
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText("processed")

  return `# ${page.data.title}

${processed}`
}
