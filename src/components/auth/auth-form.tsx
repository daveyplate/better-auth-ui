"use client"

import { Loader2 } from "lucide-react"
import { useCallback, useContext, useEffect, useRef, useState } from "react"

import type { AuthLocalization } from "../../lib/auth-localization"
import { AuthUIContext } from "../../lib/auth-ui-provider"
import type { AuthView } from "../../lib/auth-view-paths"
import { socialProviders } from "../../lib/social-providers"
import { cn, isValidEmail } from "../../lib/utils"
import { Checkbox } from "../ui/checkbox"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

import type { SocialProvider } from "better-auth/social-providers"
import type { AuthClient } from "../../types/auth-client"
import { PasswordInput } from "../password-input"
import { TwoFactorPrompt } from "../two-factor/two-factor-prompt"
import { TwoFactorQR } from "../two-factor/two-factor-qr"
import { Separator } from "../ui/separator"
import { ActionButton } from "./action-button"
import { MagicLinkButton } from "./magic-link-button"
import { PasskeyButton } from "./passkey-button"
import { ProviderButton } from "./provider-button"

// Type representing the authentication response
// with the twoFactorRedirect property added by the 2FA plugin
interface SignInResponseWithTwoFactor {
  redirect?: boolean,
  token?: string,
  url?: string,
  user?: {
    id: string,
    email: string,
    // other user fields
  },
  twoFactorRedirect?: boolean
}

export type AuthFormClassNames = {
  base?: string,
  actionButton?: string,
  forgotPasswordLink?: string,
  input?: string,
  label?: string,
  description?: string,
  providerButton?: string,
  secondaryButton?: string
}

export function AuthForm({
  className,
  classNames,
  callbackURL,
  localization,
  pathname,
  redirectTo,
  socialLayout = "auto",
  view
}: {
  className?: string,
  classNames?: AuthFormClassNames,
  callbackURL?: string,
  localization?: Partial<AuthLocalization>,
  pathname?: string,
  redirectTo?: string,
  socialLayout?: "auto" | "horizontal" | "grid" | "vertical",
  view?: AuthView
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [twoFactorUrl, setTwoFactorUrl] = useState<string>("")
  const [isBackupCode, setIsBackupCode] = useState(false)

  const {
    additionalFields,
    authClient,
    basePath,
    baseURL,
    confirmPassword: confirmPasswordEnabled,
    redirectTo: defaultRedirectTo,
    credentials,
    forgotPassword,
    hooks: { useIsRestoring, useSession },
    localization: authLocalization,
    magicLink,
    nameRequired,
    navigate,
    otherProviders,
    passkey,
    persistClient,
    providers,
    rememberMe,
    replace,
    signUp,
    signUpFields,
    toast,
    username: usernamePlugin,
    viewPaths,
    onSessionChange,
    Link
  } = useContext(AuthUIContext)

  const {
    data: sessionData,
    error: sessionError,
    isPending: sessionPending,
    refetch: refetchSession
  } = useSession()

  localization = { ...authLocalization, ...localization }

  const isRestoring = useIsRestoring?.()

  const signingOut = useRef(false)
  const isRedirecting = useRef(false)
  const checkingResetPasswordToken = useRef(false)

  if (socialLayout === "auto") {
    socialLayout = !credentials
      ? "vertical"
      : providers && providers.length > 2
        ? "horizontal"
        : "vertical"
  }

  const path = pathname?.split("/").pop()

  if (path && !Object.values(viewPaths).includes(path)) {
    console.error(`Invalid auth view: ${path}`)
  }

  view =
    view ||
    ((Object.entries(viewPaths).find(([_, value]) => value === path)?.[0] ||
      "signIn") as AuthView)

  const getRedirectTo = useCallback(
    () =>
      redirectTo ||
      new URLSearchParams(window.location.search).get("redirectTo") ||
      defaultRedirectTo,
    [defaultRedirectTo, redirectTo]
  )

  const getCallbackURL = useCallback(
    () =>
      `${baseURL}${
        callbackURL ||
        (persistClient
          ? `${basePath}/${viewPaths.callback}?redirectTo=${getRedirectTo()}`
          : getRedirectTo())
      }`,
    [baseURL, callbackURL, persistClient, viewPaths, basePath, getRedirectTo]
  )

  const onSuccess = useCallback(async () => {
    setIsLoading(true)

    await refetchSession?.()
    await onSessionChange?.()

    navigate(getRedirectTo())
    setIsLoading(false)
  }, [refetchSession, onSessionChange, navigate, getRedirectTo])

  const formAction = async (formData: FormData) => {
    const provider = formData.get("provider") as SocialProvider

    if (provider) {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: getCallbackURL()
      })

      if (error) {
        toast({ variant: "error", message: error.message || error.statusText })
      } else {
        setIsLoading(true)
      }

      return
    }

    const otherProvider = formData.get("otherProvider") as string

    if (otherProvider) {
      // @ts-ignore
      const { error } = await authClient.signIn.oauth2({
        providerId: otherProvider,
        callbackURL: getCallbackURL()
      })

      if (error) {
        toast({ variant: "error", message: error.message || error.statusText })
      } else {
        setIsLoading(true)
      }

      return
    }

    if (formData.get("passkey")) {
      const response = await (authClient as AuthClient).signIn.passkey()
      const error = response?.error
      if (error) {
        toast({ variant: "error", message: error.message || error.statusText })
      } else {
        onSuccess()
      }

      return
    }

    let email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") || ("" as string)

    switch (view) {
      case "signIn": {
        if (!credentials) {
          // @ts-expect-error Optional plugin
          const { error } = await authClient.signIn.magicLink({
            email,
            callbackURL: getCallbackURL()
          })

          if (error) {
            toast({ variant: "error", message: error.message || error.statusText })
          } else {
            toast({ variant: "success", message: localization.magicLinkEmail! })
          }

          return
        }

        const params = {
          password,
          rememberMe: !rememberMe || formData.has("rememberMe")
        }

        if (usernamePlugin) {
          const username = formData.get("username") as string

          if (isValidEmail(username)) {
            email = username
          } else {
            // @ts-expect-error Optional plugin
            const { error } = await authClient.signIn.username({
              username,
              ...params
            })

            if (error) {
              toast({ variant: "error", message: error.message || error.statusText })
            } else {
              onSuccess()
            }

            return
          }
        }

        // Handle sign-in with 2FA support
        const { data, error } = await authClient.signIn.email({
          email,
          ...params
        })

        if (error) {
          toast({ variant: "error", message: error.message || error.statusText })
        } else if ((data as SignInResponseWithTwoFactor)?.twoFactorRedirect) {
          // Redirect to 2FA verification screen if required
          navigate(`${basePath}/${viewPaths.twoFactorPrompt}`)
        } else {
          onSuccess()
        }

        break
      }

      case "magicLink": {
        // @ts-expect-error Optional plugin
        const { error } = await authClient.signIn.magicLink({
          email,
          callbackURL: getCallbackURL()
        })

        if (error) {
          toast({ variant: "error", message: error.message || error.statusText })
        } else {
          toast({ variant: "success", message: localization.magicLinkEmail! })
        }

        break
      }

      case "signUp": {
        if (confirmPasswordEnabled) {
          const confirmPassword = formData.get("confirmPassword") as string
          if (password !== confirmPassword) {
            toast({ variant: "error", message: localization.passwordsDoNotMatch! })
            return
          }
        }

        const params = {
          email,
          password,
          name,
          callbackURL: getCallbackURL()
        } as Record<string, unknown>

        if (usernamePlugin) {
          params.username = formData.get("username")
        }

        signUpFields?.map((field) => {
          if (field === "name") return

          const additionalField = additionalFields?.[field]
          if (!additionalField) return

          if (formData.has(field)) {
            const value = formData.get(field) as string

            if (additionalField.validate && !additionalField.validate(value)) {
              toast({
                variant: "error",
                message: `${localization.failedToValidate} ${field}`
              })
              return
            }

            params[field] =
              additionalField.type === "number"
                ? Number.parseFloat(value)
                : additionalField.type === "boolean"
                  ? value === "on"
                  : value
          }
        })

        // @ts-ignore
        const { data, error } = await authClient.signUp.email(params)

        if (error) {
          toast({ variant: "error", message: error.message || error.statusText })
        } else if (data.token) {
          onSuccess()
        } else {
          navigate(`${basePath}/${viewPaths.signIn}`)
          toast({ variant: "success", message: localization.signUpEmail! })
        }

        break
      }

      case "forgotPassword": {
        const { error } = await authClient.forgetPassword({
          email: email,
          redirectTo: `${baseURL}${basePath}/${viewPaths.resetPassword}`
        })

        if (error) {
          toast({ variant: "error", message: error.message || error.statusText })
        } else {
          toast({ variant: "success", message: localization.forgotPasswordEmail! })
          navigate(`${basePath}/${viewPaths.signIn}`)
        }

        break
      }

      case "resetPassword": {
        if (confirmPasswordEnabled) {
          const confirmPassword = formData.get("confirmPassword") as string
          if (password !== confirmPassword) {
            toast({ variant: "error", message: localization.passwordsDoNotMatch! })
            return
          }
        }

        const searchParams = new URLSearchParams(window.location.search)
        const token = searchParams.get("token") as string

        const { error } = await authClient.resetPassword({
          newPassword: password,
          token
        })

        if (error) {
          toast({ variant: "error", message: error.message || error.statusText })
        } else {
          toast({ variant: "success", message: localization.resetPasswordSuccess! })
          navigate(`${basePath}/${viewPaths.signIn}`)
        }

        break
      }

      case "twoFactorPrompt": {
        const code = formData.get("twoFactorCode") as string
        const trustDevice = formData.has("trustDevice")
        const isBackupCode = formData.has("isBackupCode")

        // Validate code format before sending to API
        if (isBackupCode && !/^[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}$/.test(code)) {
          toast({
            variant: "error",
            message:
              localization.invalidTwoFactorCode || "Invalid backup code format"
          })
          return
        } else if (!isBackupCode && !/^[0-9]{6}$/.test(code)) {
          toast({
            variant: "error",
            message:
              localization.invalidTwoFactorCode ||
              "Invalid authentication code format"
          })
          return
        }

        if (isBackupCode) {
          // Using backup code
          // @ts-expect-error Optional plugin
          const { error } = await authClient.twoFactor.verifyBackupCode({
            code,
            trustDevice
          })

          if (error) {
            toast({
              variant: "error",
              message: error.message || error.statusText
            })
          } else {
            onSuccess()
          }
        } else {
          // Using TOTP code
          // @ts-expect-error Optional plugin
          const { error } = await authClient.twoFactor.verifyTotp({
            code,
            trustDevice
          })

          if (error) {
            toast({
              variant: "error",
              message: error.message || error.statusText
            })
          } else {
            onSuccess()
          }
        }

        break
      }

      case "twoFactorSetup": {
        const code = formData.get("twoFactorCode") as string

        // Validate code format before sending to API
        if (!/^[0-9]{6}$/.test(code)) {
          toast({
            variant: "error",
            message:
              localization.invalidTwoFactorCode ||
              "Invalid authentication code format"
          })
          return
        }

        // Use the proper method for verifying during setup
        // @ts-expect-error Optional plugin
        const response = await authClient.twoFactor.verifyTotp({
          code
        })

        const { error } = response || {}

        if (error) {
          toast({
            variant: "error",
            message: error.message || error.statusText
          })
        } else {
          // Afficher un message de succès et rediriger
          toast({
            variant: "success",
            message: localization.twoFactorEnabled!
          })
          setTwoFactorUrl("")

          // Check if we need to refresh session data after setup
          const shouldRefresh =
            sessionStorage.getItem("shouldRefreshAfterTwoFactorSetup") ===
            "true"
          if (shouldRefresh) {
            sessionStorage.removeItem("shouldRefreshAfterTwoFactorSetup")

            // Determine which refetch function to use
            const refetchFunction = sessionStorage.getItem(
              "twoFactorRefetchFunction"
            )
            sessionStorage.removeItem("twoFactorRefetchFunction")

            // Always refresh session data
            await refetchSession?.()
            await onSessionChange?.()
          }

          navigate(getRedirectTo())
        }

        break
      }
    }
  }

  const handleTwoFactorComplete = async (
    code: string,
    trustDevice: boolean = false,
    isBackupCode: boolean = false
  ) => {
    if (!code) return

    // Prevent multiple submissions of the same code
    if (isLoading) return

    setIsLoading(true)
    try {
      if (isBackupCode) {
        // Using backup code
        // @ts-expect-error Optional plugin
        const { error } = await authClient.twoFactor.verifyBackupCode({
          code,
          trustDevice
        })

        if (error) {
          toast({
            variant: "error",
            message: error.message || error.statusText
          })
        } else {
          onSuccess()
        }
      } else {
        // Using TOTP code
        // @ts-expect-error Optional plugin
        const { error } = await authClient.twoFactor.verifyTotp({
          code,
          trustDevice
        })

        if (error) {
          toast({
            variant: "error",
            message: error.message || error.statusText
          })
        } else {
          onSuccess()
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (view !== "signOut") {
      signingOut.current = false
    }

    if (view !== "callback") {
      isRedirecting.current = false
    }
  }, [view])

  useEffect(() => {
    if (view !== "signOut" || signingOut.current) return

    signingOut.current = true
    authClient.signOut().finally(async () => {
      await refetchSession?.()
      await onSessionChange?.()
      replace(`${basePath}/${viewPaths.signIn}`)
    })
  }, [view, authClient, onSessionChange, refetchSession, replace, basePath, viewPaths])

  useEffect(() => {
    if (view !== "resetPassword" || checkingResetPasswordToken.current) return

    checkingResetPasswordToken.current = true

    const searchParams = new URLSearchParams(window.location.search)
    const token = searchParams.get("token")
    if (!token || token === "INVALID_TOKEN") {
      navigate(`${basePath}/${viewPaths.signIn}`)
      setTimeout(() => {
        toast({ variant: "error", message: localization.resetPasswordInvalidToken! })
        checkingResetPasswordToken.current = false
      }, 100)
    }
  }, [basePath, view, viewPaths, navigate, localization, toast])

  useEffect(() => {
    if (view === "magicLink" && !magicLink) {
      replace(`${basePath}/${viewPaths.signIn}`)
    }

    if (view === "signUp" && !signUp) {
      replace(`${basePath}/${viewPaths.signIn}`)
    }

    if (["signUp", "forgotPassword", "resetPassword"].includes(view) && !credentials) {
      replace(`${basePath}/${viewPaths.signIn}`)
    }
  }, [basePath, view, viewPaths, credentials, replace, signUp, magicLink])

  useEffect(() => {
    if (view !== "callback" || isRedirecting.current) return

    if (!persistClient) {
      replace(getRedirectTo())
      return
    }

    if (isRestoring) return

    isRedirecting.current = true

    onSuccess()
  }, [isRestoring, view, replace, persistClient, getRedirectTo, onSuccess])

  useEffect(() => {
    if (view === "twoFactorSetup" && !twoFactorUrl) {
      // Retrieve URI from sessionStorage (stored by TwoFactorCard)
      const storedUri = sessionStorage.getItem("twoFactorSetupURI")
      if (storedUri) {
        setTwoFactorUrl(storedUri)
        // Clean up after use
        sessionStorage.removeItem("twoFactorSetupURI")
      } else {
        // Fallback to enable method if URI is not found in sessionStorage
        // @ts-expect-error Optional plugin
        authClient.twoFactor.enable().then((response) => {
          if (!response.error && response.data?.totpURI) {
            setTwoFactorUrl(response.data.totpURI)
          }
        })
      }
    }
  }, [view, authClient, twoFactorUrl])

  if (["signOut", "callback"].includes(view)) return <Loader2 className="animate-spin" />

  if (view === "twoFactorPrompt" || view === "twoFactorSetup") {
    return (
      <form
        action={formAction}
        className={cn("grid w-full gap-6", className, classNames?.base)}
      >
        {view === "twoFactorSetup" && twoFactorUrl && (
          <div className="flex justify-center py-2 mb-6">
            <TwoFactorQR uri={twoFactorUrl} localization={localization} />
          </div>
        )}

        <TwoFactorPrompt
          error={sessionError?.message}
          isSubmitting={isLoading}
          onSubmit={(code, trustDevice) => {
            const formData = new FormData()
            formData.append("twoFactorCode", code)
            if (trustDevice) {
              formData.append("trustDevice", "true")
            }
            if (isBackupCode) {
              formData.append("isBackupCode", "true")
            }
            formAction(formData)
          }}
          onBackupCodeToggle={setIsBackupCode}
          localization={localization}
          isSetup={view === "twoFactorSetup"}
        />
      </form>
    )
  }

  return (
    <form action={formAction} className={cn("grid w-full gap-6", className, classNames?.base)}>
      {credentials &&
        view === "signUp" &&
        (nameRequired || signUpFields?.includes("name")) && (
          <div className="grid gap-2">
            <Label className={classNames?.label} htmlFor="name">
              {localization.name}
            </Label>

            <Input
              className={classNames?.input}
              id="name"
              name="name"
              placeholder={localization.namePlaceholder}
              required={nameRequired}
            />
          </div>
        )}

      {credentials && usernamePlugin && ["signIn", "signUp"].includes(view) && (
        <div className="grid gap-2">
          <Label className={classNames?.label} htmlFor="username">
            {localization.username}
          </Label>

          <Input
            className={classNames?.input}
            id="username"
            name="username"
            placeholder={
              view === "signIn"
                ? localization.usernameSignInPlaceholder
                : localization.usernamePlaceholder
            }
            required
          />
        </div>
      )}

      {(credentials || (["signIn", "magicLink"].includes(view) && magicLink)) &&
        ((!usernamePlugin && view !== "resetPassword") ||
          ["signUp", "magicLink", "forgotPassword"].includes(view)) && (
          <div className="grid gap-2">
            <Label className={classNames?.label} htmlFor="email">
              {localization.email}
            </Label>

            <Input
              className={classNames?.input}
              id="email"
              name="email"
              placeholder={localization.emailPlaceholder}
              required
              type="email"
            />
          </div>
        )}

      {credentials && ["signUp", "signIn", "resetPassword"].includes(view) && (
        <>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label className={classNames?.label} htmlFor="password">
                {localization.password}
              </Label>

              {view === "signIn" && forgotPassword && (
                <Link
                  className={cn(
                    "-my-1 ml-auto inline-block text-sm hover:underline",
                    classNames?.forgotPasswordLink
                  )}
                  href={`${basePath}/${viewPaths.forgotPassword}`}
                >
                  {localization.forgotPasswordLink}
                </Link>
              )}
            </div>

            <PasswordInput
              id="password"
              name="password"
              autoComplete={
                ["signUp", "resetPassword"].includes(view)
                  ? "new-password"
                  : "password"
              }
              className={classNames?.input}
              enableToggle={view !== "signIn"}
              placeholder={localization.passwordPlaceholder}
              required
            />
          </div>

          {confirmPasswordEnabled && ["signUp", "resetPassword"].includes(view) && (
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label className={classNames?.label} htmlFor="password">
                  {localization.confirmPassword}
                </Label>
              </div>

              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
                className={classNames?.input}
                enableToggle
                placeholder={localization.confirmPasswordPlaceholder}
                required
              />
            </div>
          )}
        </>
      )}

      {view === "signIn" && rememberMe && (
        <div className="flex items-center gap-2">
          <Checkbox id="rememberMe" name="rememberMe" />

          <Label htmlFor="rememberMe">{localization.rememberMe}</Label>
        </div>
      )}

      {view === "signUp" &&
        signUpFields
          ?.filter((field) => field !== "name")
          .map((field) => {
            const additionalField = additionalFields?.[field]

            if (!additionalField) {
              console.error(`Invalid additional field: ${field}`)
              return null
            }

            return additionalField.type === "boolean" ? (
              <div key={field} className="flex items-center gap-2">
                <Checkbox
                  id={field}
                  name={field}
                  required={additionalField.required}
                />

                <Label className={cn(classNames?.label)} htmlFor={field}>
                  {additionalField?.label}
                </Label>
              </div>
            ) : (
              <div key={field} className="grid gap-2">
                <Label className={classNames?.label} htmlFor={field}>
                  {additionalField?.label}
                </Label>

                <Input
                  className={classNames?.input}
                  id={field}
                  name={field}
                  placeholder={
                    additionalField?.placeholder ||
                    (typeof additionalField?.label === "string"
                      ? additionalField?.label
                      : "")
                  }
                  required={additionalField?.required}
                  type={additionalField?.type === "number" ? "number" : "text"}
                />
              </div>
            )
          })}

      <div className="flex flex-col gap-4">
        {(credentials || (["signIn", "magicLink"].includes(view) && magicLink)) && (
          <ActionButton
            authView={view}
            className={classNames?.actionButton}
            isLoading={isLoading}
            localization={localization}
          />
        )}

        {magicLink && credentials && view !== "resetPassword" && (
          <MagicLinkButton
            className={classNames?.secondaryButton}
            isLoading={isLoading}
            localization={localization}
            view={view}
          />
        )}
      </div>

      {!["forgotPassword", "resetPassword"].includes(view) &&
        (providers?.length || otherProviders?.length) && (
          <>
            {credentials && (
              <div className="flex items-center gap-2">
                <Separator className="!w-auto grow" />
                <span className="flex-shrink-0 text-muted-foreground text-sm">
                  {localization.orContinueWith}
                </span>
                <Separator className="!w-auto grow" />
              </div>
            )}
            <div
              className={cn(
                "flex w-full items-center gap-4",
                "justify-between",
                socialLayout === "horizontal" && "flex-wrap",
                socialLayout === "vertical" && "flex-col",
                socialLayout === "grid" && "grid grid-cols-2"
              )}
            >
              {providers?.map((provider) => {
                const socialProvider = socialProviders.find(
                  (socialProvider) => socialProvider.provider === provider
                )
                if (!socialProvider) return null

                return (
                  <ProviderButton
                    key={provider}
                    className={classNames?.providerButton}
                    isLoading={isLoading}
                    localization={localization}
                    socialLayout={socialLayout}
                    provider={socialProvider}
                  />
                )
              })}

              {otherProviders?.map((provider) => (
                <ProviderButton
                  key={provider.provider}
                  className={classNames?.providerButton}
                  isLoading={isLoading}
                  localization={localization}
                  socialLayout={socialLayout}
                  provider={provider}
                  other
                />
              ))}
            </div>
          </>
        )}

      {passkey && (
        <PasskeyButton
          className={classNames?.secondaryButton}
          isLoading={isLoading}
          localization={localization}
        />
      )}
    </form>
  )
}
