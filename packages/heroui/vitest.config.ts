import { resolve } from "node:path"
import react from "@vitejs/plugin-react"
import { playwright } from "@vitest/browser-playwright"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@better-auth-ui/core": resolve(__dirname, "../core/src"),
      "@better-auth-ui/react": resolve(__dirname, "../react/src")
    }
  },
  test: {
    globals: true,
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }]
    },
    include: ["tests/**/*.test.{ts,tsx}"]
  }
})
