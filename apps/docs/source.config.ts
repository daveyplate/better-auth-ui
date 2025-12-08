import { defineConfig, defineDocs } from "fumadocs-mdx/config"
import { createGenerator, remarkAutoTypeTable } from "fumadocs-typescript"
import remarkCodeImport from "remark-code-import"

const generator = createGenerator()

export const docs = defineDocs({
  dir: "content/docs"
})

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [
      [remarkCodeImport, { allowImportingFromOutside: true }],
      [remarkAutoTypeTable, { generator }]
    ],
    remarkNpmOptions: {
      persist: {
        id: "package-manager"
      }
    }
  }
})
