import type { AuthConfig } from "../components/auth-provider"
import type { AuthClient } from "../types/auth-client"

export function receiveConfig<TAuthClient extends AuthClient>(
  config: Partial<AuthConfig<TAuthClient>>
) {
  return {
    emailAndPassword: {
      enabled: true
    },
    navigate: (path: string) => {
      window.location.href = path
    },
    replace: (path: string) => window.location.replace(path),
    Link: (props) => <a {...props} />,
    ...config
  } as AuthConfig<TAuthClient>
}
