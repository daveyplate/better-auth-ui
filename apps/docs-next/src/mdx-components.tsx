import { createGenerator } from "fumadocs-typescript"
import { AutoTypeTable } from "fumadocs-typescript/ui"
import defaultMdxComponents from "fumadocs-ui/mdx"
import { cn } from "fumadocs-ui/utils/cn"
import type { MDXComponents } from "mdx/types"

const generator = createGenerator()

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    AutoTypeTable: (props) => (
      <AutoTypeTable {...props} generator={generator} />
    ),
    Demo: ({ src, className }: { src: string; className?: string }) => (
      <iframe
        title="Demo"
        src={src}
        className={cn("w-full border rounded-xl", className)}
      />
    ),
    ...components
  }
}
