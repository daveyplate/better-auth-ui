"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { type ReactNode, useContext } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import type { AuthLocalization } from "../../../lib/auth-localization"
import { AuthUIContext } from "../../../lib/auth-ui-provider"
import { cn, getLocalizedError } from "../../../lib/utils"
import type { FieldType } from "../../../types/additional-fields"
import { CardContent } from "../../ui/card"
import { Checkbox } from "../../ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form"
import { Input } from "../../ui/input"
import { Skeleton } from "../../ui/skeleton"
import { SettingsCard, type SettingsCardClassNames } from "./settings-card"

export interface UpdateFieldCardProps {
    className?: string
    classNames?: SettingsCardClassNames
    description?: ReactNode
    instructions?: ReactNode
    isPending?: boolean
    localization?: Partial<AuthLocalization>
    name: string
    placeholder?: string
    required?: boolean
    label?: ReactNode
    type?: FieldType
    value?: unknown
    validate?: (value: string) => boolean | Promise<boolean>
    onSuccess?: () => void
}

export function UpdateFieldCard({
    className,
    classNames,
    description,
    instructions,
    isPending,
    localization,
    name,
    placeholder,
    required,
    label,
    type,
    value,
    validate,
    onSuccess
}: UpdateFieldCardProps) {
    const {
        hooks: { useSession },
        mutators: { updateUser },
        localization: contextLocalization,
        optimistic,
        toast
    } = useContext(AuthUIContext)

    localization = { ...contextLocalization, ...localization }

    const { isPending: sessionPending, refetch } = useSession()

    let fieldSchema = z.unknown() as z.ZodType<unknown>

    // Create the appropriate schema based on type
    if (type === "number") {
        fieldSchema = required
            ? z.preprocess(
                  (val) => (!val ? undefined : Number(val)),
                  z.number({
                      required_error: `${label} ${localization.isRequired}`,
                      invalid_type_error: `${label} ${localization.isInvalid}`
                  })
              )
            : z.coerce
                  .number({
                      invalid_type_error: `${label} ${localization.isInvalid}`
                  })
                  .optional()
    } else if (type === "boolean") {
        fieldSchema = required
            ? z.coerce
                  .boolean({
                      required_error: `${label} ${localization.isRequired}`,
                      invalid_type_error: `${label} ${localization.isInvalid}`
                  })
                  .refine((val) => val === true, {
                      message: `${label} ${localization.isRequired}`
                  })
            : z.coerce.boolean({
                  invalid_type_error: `${label} ${localization.isInvalid}`
              })
    } else {
        fieldSchema = required
            ? z.string().min(1, `${label} ${localization.isRequired}`)
            : z.string().optional()
    }

    const form = useForm({
        resolver: zodResolver(z.object({ [name]: fieldSchema })),
        values: { [name]: value || "" }
    })

    const { isSubmitting } = form.formState

    const updateField = async (values: Record<string, unknown>) => {
        await new Promise((resolve) => setTimeout(resolve))
        const newValue = values[name]

        if (value === newValue) {
            toast({
                variant: "error",
                message: `${label} ${localization.isTheSame}`
            })
            return
        }

        if (validate && typeof newValue === "string" && !(await validate(newValue))) {
            form.setError(name, {
                message: `${label} ${localization.isInvalid}`
            })

            return
        }

        try {
            await updateUser({ [name]: newValue })

            await refetch?.()
            toast({
                variant: "success",
                message: `${label} ${localization.updatedSuccessfully}`
            })
        } catch (error) {
            toast({
                variant: "error",
                message: getLocalizedError({ error, localization })
            })
        }
    }

    const handleUpdateField = async (values: Record<string, unknown>) => {
        await updateField(values);
        onSuccess?.();
      };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateField)}>
                <SettingsCard
                    className={className}
                    classNames={classNames}
                    description={description}
                    instructions={instructions}
                    isPending={isPending || sessionPending}
                    title={label}
                    actionLabel={localization.save}
                    optimistic={optimistic}
                >
                    <CardContent className={classNames?.content}>
                        {type === "boolean" ? (
                            <FormField
                                control={form.control}
                                name={name}
                                render={({ field }) => (
                                    <FormItem className="flex">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value as boolean}
                                                onCheckedChange={field.onChange}
                                                disabled={isSubmitting}
                                                className={classNames?.checkbox}
                                            />
                                        </FormControl>

                                        <FormLabel className={classNames?.label}>{label}</FormLabel>

                                        <FormMessage className={classNames?.error} />
                                    </FormItem>
                                )}
                            />
                        ) : isPending ? (
                            <Skeleton className={cn("h-9 w-full", classNames?.skeleton)} />
                        ) : (
                            <FormField
                                control={form.control}
                                name={name}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                className={classNames?.input}
                                                placeholder={
                                                    placeholder ||
                                                    (typeof label === "string" ? label : "")
                                                }
                                                type={type}
                                                disabled={isSubmitting}
                                                {...field}
                                                value={field.value as string}
                                            />
                                        </FormControl>

                                        <FormMessage className={classNames?.error} />
                                    </FormItem>
                                )}
                            />
                        )}
                    </CardContent>
                </SettingsCard>
            </form>
        </Form>
    )
}
