import { defineConfig, defineDocs } from "fumadocs-mdx/config"
import remarkCodeImport from "remark-code-import"

export const docs = defineDocs({
  dir: "content/docs"
})

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkCodeImport]
  }
})
