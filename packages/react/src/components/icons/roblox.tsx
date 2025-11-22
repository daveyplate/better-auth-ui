import type { ComponentPropsWithRef } from "react"

export function Roblox({
  className,
  ...props
}: ComponentPropsWithRef<"svg">) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Roblox</title>
      <path
        d="M18.926 23.998L0 18.892L5.075.002L24 5.108ZM15.348 10.09l-5.282-1.453l-1.414 5.273l5.282 1.453z"
        fill="currentColor"
      />
    </svg>
  )
}

