import { useSyncExternalStore } from "react"

export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}

function subscribe() {
  return () => {}
}
