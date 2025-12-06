import { SignIn } from "@better-auth-ui/heroui"

export default function SignInPage() {
  return (
    <div className="flex flex-col p-4 md:p-6 my-auto items-center">
      <SignIn magicLink socialProviders={["github", "google"]} />
    </div>
  )
}
