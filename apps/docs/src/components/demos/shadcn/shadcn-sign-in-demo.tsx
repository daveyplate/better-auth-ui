import { SignIn } from "@better-auth-ui/shadcn"
import { DemoProvider } from "../provider"

export function ShadcnSignInDemo() {
  return (
    <DemoProvider>
      <SignIn />
    </DemoProvider>
  )
}
