import type { ComponentPropsWithRef } from "react"

export function Vercel(props: ComponentPropsWithRef<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      role="img"
      aria-label="Vercel"
      {...props}
    >
      <path fill="currentColor" d="M23 21.648H1L12 2.352z"></path>
    </svg>
  )
}
