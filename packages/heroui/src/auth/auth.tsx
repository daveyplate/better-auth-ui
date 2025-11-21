"use client"

import type { CardProps } from "@heroui/react"
import { SignIn } from "./sign-in"

export const authViews = ["sign-in", "sign-up"] as const
export type AuthView = (typeof authViews)[number]

export function Auth({ view, ...props }: CardProps & { view: AuthView }) {
  switch (view) {
    case "sign-in":
      return <SignIn {...props} />
    case "sign-up":
      return <SignIn {...props} />
  }
}
