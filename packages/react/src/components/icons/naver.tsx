import type { ComponentPropsWithRef } from "react"

export function Naver(props: ComponentPropsWithRef<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      role="img"
      aria-label="Naver"
      {...props}
    >
      <path
        fill="currentColor"
        d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727z"
      />
    </svg>
  )
}
