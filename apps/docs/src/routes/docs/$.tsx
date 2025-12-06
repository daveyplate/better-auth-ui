import browserCollections from "fumadocs-mdx:collections/browser"
import { createFileRoute, notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions"
import type * as PageTree from "fumadocs-core/page-tree"
import { DocsLayout } from "fumadocs-ui/layouts/docs"
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle
} from "fumadocs-ui/layouts/docs/page"
import defaultMdxComponents from "fumadocs-ui/mdx"
import { useMemo } from "react"
import { Shadcn } from "@/components/icons/shadcn"
import { baseOptions } from "@/lib/layout.shared"
import { source } from "@/lib/source"
import { HeroUI } from "@/components/icons/heroui"

export const Route = createFileRoute("/docs/$")({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split("/") ?? []
    const data = await loader({ data: slugs })
    await clientLoader.preload(data.path)
    return data
  }
})

const loader = createServerFn({
  method: "GET"
})
  .inputValidator((slugs: string[]) => slugs)
  .middleware([staticFunctionMiddleware])
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs)
    if (!page) throw notFound()

    return {
      tree: source.pageTree as object,
      path: page.path
    }
  })

const clientLoader = browserCollections.docs.createClientLoader({
  component({ toc, frontmatter, default: MDX }) {
    return (
      <DocsPage toc={toc}>
        <DocsTitle>{frontmatter.title}</DocsTitle>
        <DocsDescription>{frontmatter.description}</DocsDescription>
        <DocsBody>
          <MDX
            components={{
              ...defaultMdxComponents
            }}
          />
        </DocsBody>
      </DocsPage>
    )
  }
})

function Page() {
  const data = Route.useLoaderData()
  const Content = clientLoader.getComponent(data.path)
  const tree = useMemo(
    () => transformPageTree(data.tree as PageTree.Folder),
    [data.tree]
  )

  return (
    <DocsLayout {...baseOptions()} tree={tree}>
      <Content />
    </DocsLayout>
  )
}

// Map of custom icon identifiers to React components
const customIcons: Record<string, React.ReactNode> = {
  shadcn: <Shadcn />,
  heroui: <HeroUI />
}

function transformPageTree(root: PageTree.Root): PageTree.Root {
  function mapNode<T extends PageTree.Node>(item: T): T {
    if (typeof item.icon === "string") {
      if (item.icon in customIcons) {
        item = {
          ...item,
          icon: customIcons[item.icon]
        }
      } else {
        item = {
          ...item,
          icon: (
            <span
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Icons are safe
              dangerouslySetInnerHTML={{
                __html: item.icon
              }}
            />
          )
        }
      }
    }

    if (item.type === "folder") {
      return {
        ...item,
        index: item.index ? mapNode(item.index) : undefined,
        children: item.children.map(mapNode)
      }
    }

    return item
  }

  return {
    ...root,
    children: root.children.map(mapNode),
    fallback: root.fallback ? transformPageTree(root.fallback) : undefined
  }
}
