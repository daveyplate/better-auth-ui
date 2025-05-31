"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { BetterFetchOption } from "better-auth/react"
import { Loader2 } from "lucide-react"
import { useCallback, useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { useCaptcha } from "../../../hooks/use-captcha"
import { useIsHydrated } from "../../../hooks/use-hydrated"
import { useOnSuccessTransition } from "../../../hooks/use-success-transition"
import type { AuthLocalization } from "../../../lib/auth-localization"
import { AuthUIContext, type PasswordValidation } from "../../../lib/auth-ui-provider"
import { cn, getLocalizedError, getPasswordSchema, getSearchParam } from "../../../lib/utils"
import type { AuthClient } from "../../../types/auth-client"
import { Captcha } from "../../captcha/captcha"
import { PasswordInput } from "../../password-input"
import { Button } from "../../ui/button"
import { Checkbox } from "../../ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../ui/select"
import { Input } from "../../ui/input"
import type { AuthFormClassNames } from "../auth-form"

export interface SignUpFormProps {
    className?: string
    classNames?: AuthFormClassNames
    callbackURL?: string
    isSubmitting?: boolean
    localization: Partial<AuthLocalization>
    redirectTo?: string
    setIsSubmitting?: (value: boolean) => void
    passwordValidation?: PasswordValidation
}

export function SignUpForm({
    className,
    classNames,
    callbackURL,
    isSubmitting,
    localization,
    redirectTo,
    setIsSubmitting,
    passwordValidation
}: SignUpFormProps) {
    const isHydrated = useIsHydrated()
    const { captchaRef, getCaptchaHeaders } = useCaptcha({ localization })

    const {
        additionalFields,
        authClient,
        basePath,
        baseURL,
        confirmPassword: confirmPasswordEnabled,
        emailVerification,
        localization: contextLocalization,
        nameRequired,
        persistClient,
        redirectTo: contextRedirectTo,
        signUpFields,
        username: usernameEnabled,
        viewPaths,
        navigate,
        toast,
        passwordValidation: contextPasswordValidation
    } = useContext(AuthUIContext)

    localization = { ...contextLocalization, ...localization }
    passwordValidation = { ...contextPasswordValidation, ...passwordValidation }

    const getRedirectTo = useCallback(
        () => redirectTo || getSearchParam("redirectTo") || contextRedirectTo,
        [redirectTo, contextRedirectTo]
    )

    const getCallbackURL = useCallback(
        () =>
            `${baseURL}${
                callbackURL ||
                (persistClient
                    ? `${basePath}/${viewPaths.callback}?redirectTo=${getRedirectTo()}`
                    : getRedirectTo())
            }`,
        [callbackURL, persistClient, basePath, viewPaths, baseURL, getRedirectTo]
    )

    const { onSuccess, isPending: transitionPending } = useOnSuccessTransition({
        redirectTo
    })

    // Determine the full list of fields to render, in order
    const requiredFields: string[] = [
        ...(nameRequired ? ["name"] : []),
        ...(usernameEnabled ? ["username"] : []),
        "email",
        "password",
        ...(confirmPasswordEnabled ? ["confirmPassword"] : [])
    ]
    let fields: string[]
    if (
        signUpFields &&
        // Avoid unexpected behaviour if the default is in use
        !(signUpFields.length === 1 && signUpFields[0] === "name")
    ) {
        // Add any missing required fields to the front, preserving order
        const missingRequired = requiredFields.filter((f) => !signUpFields.includes(f))
        fields = [...missingRequired, ...signUpFields]
    } else {
        fields = [...requiredFields]
    }

    const schemaFields: Record<string, z.ZodTypeAny> = {}
    const defaultValues: Record<string, unknown> = {}
    for (const field of fields) {
        switch (field) {
            case "name":
                schemaFields.name = nameRequired
                    ? z.string().min(1, {
                          message: `${localization.name} ${localization.isRequired}`
                      })
                    : z.string().optional()
                defaultValues.name = ""
                break
            case "username":
                schemaFields.username = z.string().min(1, {
                    message: `${localization.username} ${localization.isRequired}`
                })
                defaultValues.username = ""
                break
            case "email":
                schemaFields.email = z
                    .string()
                    .min(1, {
                        message: `${localization.email} ${localization.isRequired}`
                    })
                    .email({
                        message: `${localization.email} ${localization.isInvalid}`
                    })
                defaultValues.email = ""
                break
            case "password":
                schemaFields.password = getPasswordSchema(passwordValidation, localization)
                defaultValues.password = ""
                break
            case "confirmPassword":
                schemaFields.confirmPassword = getPasswordSchema(passwordValidation, {
                    passwordRequired: localization.confirmPasswordRequired,
                    passwordTooShort: localization.passwordTooShort,
                    passwordTooLong: localization.passwordTooLong,
                    passwordInvalid: localization.passwordInvalid
                })
                defaultValues.confirmPassword = ""
                break
            default: {
                const additionalField = additionalFields?.[field]
                if (!additionalField) continue
                let fieldSchema: z.ZodTypeAny
                if (additionalField.type === "number") {
                    fieldSchema = additionalField.required
                        ? z.preprocess(
                              (val) => (!val ? undefined : Number(val)),
                              z.number({
                                  required_error: `${additionalField.label} ${localization.isRequired}`,
                                  invalid_type_error: `${additionalField.label} ${localization.isInvalid}`
                              })
                          )
                        : z.coerce
                              .number({
                                  invalid_type_error: `${additionalField.label} ${localization.isInvalid}`
                              })
                              .optional()
                } else if (additionalField.type === "boolean") {
                    fieldSchema = additionalField.required
                        ? z.coerce
                              .boolean({
                                  required_error: `${additionalField.label} ${localization.isRequired}`,
                                  invalid_type_error: `${additionalField.label} ${localization.isInvalid}`
                              })
                              .refine((val) => val === true, {
                                  message: `${additionalField.label} ${localization.isRequired}`
                              })
                        : z.coerce
                              .boolean({
                                  invalid_type_error: `${additionalField.label} ${localization.isInvalid}`
                              })
                              .optional()
                } else if (
                    additionalField.type === "select" &&
                    Array.isArray(additionalField.options) &&
                    additionalField.options.length > 0
                ) {
                    const optionValues = additionalField.options.map((opt) => opt.value)
                    if (additionalField.required) {
                        fieldSchema = z.enum(optionValues as [string, ...string[]], {
                            required_error: `${additionalField.label} ${localization.isRequired}`,
                            invalid_type_error: `${additionalField.label} ${localization.isInvalid}`
                        })
                    } else {
                        fieldSchema = z
                            .union([z.enum(optionValues as [string, ...string[]]), z.literal("")])
                            .optional()
                    }
                    defaultValues[field] = ""
                } else {
                    fieldSchema = additionalField.required
                        ? z.string().min(1, `${additionalField.label} ${localization.isRequired}`)
                        : z.string().optional()
                }
                schemaFields[field] = fieldSchema
                defaultValues[field] = additionalField.type === "boolean" ? false : ""
            }
        }
    }

    const formSchema = z.object(schemaFields).refine(
        (data) => {
            // Skip validation if confirmPassword is not enabled
            if (!confirmPasswordEnabled) return true
            return data.password === data.confirmPassword
        },
        {
            message: localization.passwordsDoNotMatch!,
            path: ["confirmPassword"]
        }
    )

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues
    })

    isSubmitting = isSubmitting || form.formState.isSubmitting || transitionPending

    useEffect(() => {
        setIsSubmitting?.(form.formState.isSubmitting || transitionPending)
    }, [form.formState.isSubmitting, transitionPending, setIsSubmitting])

    async function signUp({
        email,
        password,
        name,
        username,
        confirmPassword,
        ...additionalFieldValues
    }: z.infer<typeof formSchema>) {
        try {
            // Validate additional fields with custom validators if provided
            for (const [field, value] of Object.entries(additionalFieldValues)) {
                const additionalField = additionalFields?.[field]
                if (!additionalField?.validate) continue

                if (typeof value === "string" && !(await additionalField.validate(value))) {
                    form.setError(field, {
                        message: `${additionalField.label} ${localization.isInvalid}`
                    })
                    return
                }
            }

            const fetchOptions: BetterFetchOption = {
                throw: true,
                headers: await getCaptchaHeaders("/sign-up/email")
            }

            const data = await (authClient as AuthClient).signUp.email({
                email,
                password,
                name: name || "",
                ...(username !== undefined && { username }),
                ...additionalFieldValues,
                ...(emailVerification && persistClient && { callbackURL: getCallbackURL() }),
                fetchOptions
            })

            if ("token" in data && data.token) {
                await onSuccess()
            } else {
                navigate(`${basePath}/${viewPaths.signIn}${window.location.search}`)
                toast({ variant: "success", message: localization.signUpEmail! })
            }
        } catch (error) {
            toast({
                variant: "error",
                message: getLocalizedError({ error, localization })
            })

            form.resetField("password")
            form.resetField("confirmPassword")
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(signUp)}
                noValidate={isHydrated}
                className={cn("grid w-full gap-6", className, classNames?.base)}
            >
                {fields.map((field) => {
                    if (field === "name") {
                        return (
                            <FormField
                                key="name"
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={classNames?.label}>
                                            {localization.name}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className={classNames?.input}
                                                placeholder={localization.namePlaceholder}
                                                disabled={isSubmitting}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className={classNames?.error} />
                                    </FormItem>
                                )}
                            />
                        )
                    }
                    if (field === "email") {
                        return (
                            <FormField
                                key="email"
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={classNames?.label}>
                                            {localization.email}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className={classNames?.input}
                                                type="email"
                                                placeholder={localization.emailPlaceholder}
                                                disabled={isSubmitting}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className={classNames?.error} />
                                    </FormItem>
                                )}
                            />
                        )
                    }
                    if (field === "password") {
                        return (
                            <FormField
                                key="password"
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={classNames?.label}>
                                            {localization.password}
                                        </FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                autoComplete="new-password"
                                                className={classNames?.input}
                                                placeholder={localization.passwordPlaceholder}
                                                disabled={isSubmitting}
                                                enableToggle
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className={classNames?.error} />
                                    </FormItem>
                                )}
                            />
                        )
                    }
                    if (field === "confirmPassword") {
                        return (
                            <FormField
                                key="confirmPassword"
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={classNames?.label}>
                                            {localization.confirmPassword}
                                        </FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                autoComplete="new-password"
                                                className={classNames?.input}
                                                placeholder={
                                                    localization.confirmPasswordPlaceholder
                                                }
                                                disabled={isSubmitting}
                                                enableToggle
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className={classNames?.error} />
                                    </FormItem>
                                )}
                            />
                        )
                    }
                    if (field === "username") {
                        return (
                            <FormField
                                key="username"
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={classNames?.label}>
                                            {localization.username}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className={classNames?.input}
                                                placeholder={localization.usernamePlaceholder}
                                                disabled={isSubmitting}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className={classNames?.error} />
                                    </FormItem>
                                )}
                            />
                        )
                    }
                    // Additional fields
                    const additionalField = additionalFields?.[field]
                    if (!additionalField) return null
                    if (additionalField.type === "boolean") {
                        return (
                            <FormField
                                key={field}
                                control={form.control}
                                name={field}
                                render={({ field: formField }) => (
                                    <FormItem className="flex">
                                        <FormControl>
                                            <Checkbox
                                                checked={formField.value as boolean}
                                                onCheckedChange={formField.onChange}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormLabel className={classNames?.label}>
                                            {additionalField.label}
                                        </FormLabel>
                                        <FormMessage className={classNames?.error} />
                                    </FormItem>
                                )}
                            />
                        )
                    }
                    if (additionalField.type === "select" && additionalField.options) {
                        return (
                            <FormField
                                key={field}
                                control={form.control}
                                name={field}
                                render={({ field: formField }) => (
                                    <FormItem>
                                        <FormLabel className={classNames?.label}>
                                            {additionalField.label}
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                value={formField.value}
                                                onValueChange={formField.onChange}
                                                disabled={isSubmitting}
                                                name={formField.name}
                                            >
                                                <SelectTrigger className={classNames?.input}>
                                                    <SelectValue
                                                        placeholder={
                                                            additionalField.placeholder ||
                                                            (typeof additionalField.label ===
                                                            "string"
                                                                ? additionalField.label
                                                                : "")
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {additionalField.options?.map((opt) => (
                                                        <SelectItem
                                                            key={opt.value}
                                                            value={opt.value}
                                                        >
                                                            {opt.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage className={classNames?.error} />
                                    </FormItem>
                                )}
                            />
                        )
                    }
                    return (
                        <FormField
                            key={field}
                            control={form.control}
                            name={field}
                            render={({ field: formField }) => (
                                <FormItem>
                                    <FormLabel className={classNames?.label}>
                                        {additionalField.label}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className={classNames?.input}
                                            type={
                                                additionalField.type === "number"
                                                    ? "number"
                                                    : "text"
                                            }
                                            placeholder={
                                                additionalField.placeholder ||
                                                (typeof additionalField.label === "string"
                                                    ? additionalField.label
                                                    : "")
                                            }
                                            disabled={isSubmitting}
                                            {...formField}
                                        />
                                    </FormControl>
                                    <FormMessage className={classNames?.error} />
                                </FormItem>
                            )}
                        />
                    )
                })}

                <Captcha ref={captchaRef} localization={localization} action="/sign-up/email" />

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn("w-full", classNames?.button, classNames?.primaryButton)}
                >
                    {isSubmitting ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        localization.signUpAction
                    )}
                </Button>
            </form>
        </Form>
    )
}
