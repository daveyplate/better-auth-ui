"use client"

import { cn } from "fumadocs-ui/utils/cn"
import { useEffect, useRef, useState } from "react"

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
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Reset loaded state when src changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: src is intentionally used to reset state
  useEffect(() => {
    setIsLoaded(false)
  }, [src])

  // Set up load listener
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const handleLoad = () => {
      setIsLoaded(true)
    }

    // Check if already loaded (in case load event fires before listener is attached)
    try {
      if (iframe.contentDocument?.readyState === "complete") {
        handleLoad()
        return
      }
    } catch {
      // Cross-origin iframe - can't access contentDocument, but load event will still fire
    }

    iframe.addEventListener("load", handleLoad)

    return () => {
      iframe.removeEventListener("load", handleLoad)
    }
  }, [])

  return (
    <iframe
      ref={iframeRef}
      title={title}
      src={src}
      className={cn(
        "w-full border rounded-xl bg-transparent transition-all",
        isLoaded ? "opacity-100" : "opacity-0",
        className
      )}
    />
  )
}
