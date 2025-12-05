import { createFileRoute, Link } from "@tanstack/react-router"
import { HomeLayout } from "fumadocs-ui/layouts/home"
import { baseOptions } from "@/lib/layout.shared"

export const Route = createFileRoute("/")({
  component: Home
})

function Home() {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="relative min-h-[calc(100svh-4rem)] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-neutral-50 dark:bg-neutral-950" />

        {/* Subtle gradient accent */}
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-orange-500/50 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-orange-100/40 via-transparent to-transparent dark:from-orange-500/5" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-6 pt-20 pb-16 text-center sm:pt-32">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
            Open Source Authentication UI
          </div>

          {/* Main heading */}
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl dark:text-white">
            Beautiful auth components for{" "}
            <span className="text-orange-500 dark:text-orange-400">
              Better Auth
            </span>
          </h1>

          {/* Tagline */}
          <p className="mt-6 max-w-xl text-lg text-neutral-600 dark:text-neutral-400">
            Ready-to-use, fully customizable authentication UI built with
            shadcn/ui. Drop-in components for sign in, sign up, and more.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/docs/$"
              params={{ _splat: "" }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
            >
              Get Started
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <a
              href="https://github.com/daveyplate/better-auth-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
                />
              </svg>
              GitHub
            </a>
          </div>

          {/* Install command */}
          <div className="mt-12 inline-flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 font-mono text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
            <span className="text-neutral-400 dark:text-neutral-600">$</span>
            <span>
              npx shadcn@latest add "https://better-auth-ui.com/r/sign-in"
            </span>
            <button
              type="button"
              className="text-neutral-400 transition-colors hover:text-neutral-600 dark:text-neutral-600 dark:hover:text-neutral-400"
              onClick={() =>
                navigator.clipboard.writeText(
                  'npx shadcn@latest add "https://better-auth-ui.com/r/sign-in"'
                )
              }
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                />
              </svg>
            </button>
          </div>

          {/* Auth cards preview */}
          <div className="relative mt-20 w-full max-w-4xl">
            <div className="relative flex justify-center gap-6">
              {/* Sign In Card */}
              <div className="w-80 shrink-0 rounded-xl border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-900/5 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-neutral-900/50">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Sign In
                </h3>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  Enter your email below to login to your account
                </p>
                <div className="mt-5 space-y-4">
                  <div>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Email
                    </span>
                    <div className="mt-1.5 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800">
                      m@example.com
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Password
                      </span>
                      <span className="text-sm text-orange-500">
                        Forgot password?
                      </span>
                    </div>
                    <div className="mt-1.5 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800">
                      ••••••••
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-full rounded-md bg-neutral-900 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
                  >
                    Login
                  </button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-2 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { key: "github", icon: "G" },
                      { key: "google", icon: "G" },
                      { key: "apple", icon: "A" },
                      { key: "twitter", icon: "X" }
                    ].map((provider) => (
                      <div
                        key={provider.key}
                        className="flex h-10 items-center justify-center rounded-md border border-neutral-200 text-sm text-neutral-600 dark:border-neutral-700 dark:text-neutral-400"
                      >
                        {provider.icon}
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
                  Don't have an account?{" "}
                  <span className="text-orange-500">Sign up</span>
                </p>
              </div>

              {/* Sign Up Card - Hidden on mobile */}
              <div className="hidden w-80 shrink-0 translate-y-12 rounded-xl border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-900/5 sm:block dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-neutral-900/50">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Sign Up
                </h3>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  Enter your information to create an account
                </p>
                <div className="mt-5 space-y-4">
                  <div>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Name
                    </span>
                    <div className="mt-1.5 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800">
                      John Doe
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Email
                    </span>
                    <div className="mt-1.5 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800">
                      m@example.com
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Password
                    </span>
                    <div className="mt-1.5 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800">
                      ••••••••
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-full rounded-md bg-neutral-900 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
                  >
                    Create account
                  </button>
                </div>
                <p className="mt-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
                  Already have an account?{" "}
                  <span className="text-orange-500">Sign in</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  )
}
