"use client"

import { cn } from "fumadocs-ui/utils/cn"
import { useState } from "react"

interface DemoIframeProps {
  src: string
  className?: string
  title?: string
}

export function DemoIframe({
  src,
  className,
  title = "Demo"
}: DemoIframeProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <iframe
      title={title}
      src={src}
      onLoad={() => setIsLoaded(true)}
      className={cn(
        "w-full border rounded-xl bg-transparent transition-all",
        isLoaded ? "opacity-100" : "opacity-0",
        className
      )}
    />
  )
}
