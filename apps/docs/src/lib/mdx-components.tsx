import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock"
import defaultComponents from "fumadocs-ui/mdx"
import type { MDXComponents } from "mdx/types"
import { cn } from "./utils"

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    // HTML `ref` attribute conflicts with `forwardRef`
    pre: ({ ref: _ref, ...props }) => (
      <CodeBlock {...props}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
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
