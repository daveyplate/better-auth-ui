import type { ComponentProps } from "react"
import type { AuthConfigWithClient } from "../auth-provider"
import type { AuthClient } from "../types/auth-client"

const DefaultLink = (props: ComponentProps<"a">) => <a {...props} />

export function receiveConfig<TAuthClient extends AuthClient>(
  config: Partial<AuthConfigWithClient<TAuthClient>>
) {
  return {
    navigate: (path: string) => {
      window.location.href = path
    },
    replace: (path: string) => {
      window.location.replace(path)
    },
    Link: DefaultLink,
    ...config
  }
}
