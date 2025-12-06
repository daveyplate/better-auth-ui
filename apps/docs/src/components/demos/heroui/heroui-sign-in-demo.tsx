import { SignIn } from "@better-auth-ui/heroui"
import { DemoProvider } from "../provider"

export function HeroUISignInDemo() {
  return (
    <DemoProvider>
      <SignIn />
    </DemoProvider>
  )
}
