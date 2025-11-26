import type { ComponentPropsWithRef } from "react"

export function Microsoft(props: ComponentPropsWithRef<"svg">) {
  return (
    <svg
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Microsoft"
      {...props}
    >
      <path d="M121.666 121.666H0V0h121.666z" fill="#f1511b" />
      <path d="M256 121.666H134.335V0H256z" fill="#80cc28" />
      <path d="M121.663 256.002H0V134.336h121.663z" fill="#00adef" />
      <path d="M256 256.002H134.335V134.336H256z" fill="#fbbc09" />
    </svg>
  )
}
