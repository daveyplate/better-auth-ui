import { createGenerator } from "fumadocs-typescript"
import { AutoTypeTable } from "fumadocs-typescript/ui"
import defaultMdxComponents from "fumadocs-ui/mdx"
import type { MDXComponents } from "mdx/types"
import { DemoIframe } from "@/components/demo-iframe"

const generator = createGenerator()

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    AutoTypeTable: (props) => (
      <AutoTypeTable {...props} generator={generator} />
    ),
    Demo: ({ src, className }: { src: string; className?: string }) => (
      <DemoIframe src={src} className={className} />
    ),
    ...components
  }
}
