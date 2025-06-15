import { preserveDirectivesPlugin } from "esbuild-plugin-preserve-directives"
import { defineConfig } from "tsup"

export default defineConfig((env) => {
    return {
        entry: {
            index: "./src/index.ts",
            server: "./src/server.ts",
            tanstack: "./src/tanstack.ts",
            instantdb: "./src/instantdb.ts",
            triplit: "./src/triplit.ts",
            utils: "./src/utils.ts",
            ui: "./src/ui.ts",
            captcha: "./src/captcha.ts"
        },
        format: ["esm", "cjs"],
        splitting: true,
        cjsInterop: true,
        skipNodeModulesBundle: true,
        treeshake: false,
        metafile: true,
        esbuildPlugins: [
            preserveDirectivesPlugin({
                directives: ["use client", "use strict"],
                include: /\.(js|ts|jsx|tsx)$/,
                exclude: /node_modules/
            })
        ]
    }
})
