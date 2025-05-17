"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { type ComponentProps, useContext } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Loader2 } from "lucide-react"
import { AuthUIContext } from "../../../lib/auth-ui-provider"
import { cn, getLocalizedError } from "../../../lib/utils"
import type { AuthClient } from "../../../types/auth-client"
import { Button } from "../../ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "../../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form"
import { Input } from "../../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import type { SettingsCardClassNames } from "../shared/settings-card"

interface ApiKeyNameDialogProps extends ComponentProps<typeof Dialog> {
    classNames?: SettingsCardClassNames
    onSuccess: (key: string) => void
    refetch?: () => Promise<void>
}

export function ApiKeyNameDialog({
    classNames,
    onSuccess,
    refetch,
    onOpenChange,
    ...props
}: ApiKeyNameDialogProps) {
    const { authClient, localization, toast } = useContext(AuthUIContext)

    const formSchema = z.object({
        name: z.string().min(1, `${localization.name} ${localization.isRequired}`),
        expiresInDays: z.string().optional()
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            expiresInDays: "none"
        }
    })

    const { isSubmitting } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const expiresIn =
                values.expiresInDays && values.expiresInDays !== "none"
                    ? Number.parseInt(values.expiresInDays) * 60 * 60 * 24
                    : undefined

            const result = await (authClient as AuthClient).apiKey.create({
                name: values.name,
                expiresIn,
                fetchOptions: { throw: true }
            })

            await refetch?.()
            onSuccess(result.key)
            onOpenChange?.(false)
            form.reset()
        } catch (error) {
            toast({
                variant: "error",
                message: getLocalizedError({ error, localization })
            })
        }
    }

    return (
        <Dialog onOpenChange={onOpenChange} {...props}>
            <DialogContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                className={classNames?.dialog?.content}
            >
                <DialogHeader className={classNames?.dialog?.header}>
                    <DialogTitle className={cn("text-lg md:text-xl", classNames?.title)}>
                        {localization.createApiKey}
                    </DialogTitle>

                    <DialogDescription
                        className={cn("text-xs md:text-sm", classNames?.description)}
                    >
                        {localization.createApiKeyDescription}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel className={classNames?.label}>
                                            {localization.name}
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                className={classNames?.input}
                                                placeholder={localization.apiKeyNamePlaceholder}
                                                autoFocus
                                                disabled={isSubmitting}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="expiresInDays"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={classNames?.label}>
                                            {localization.expiresIn}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={isSubmitting}
                                        >
                                            <FormControl>
                                                <SelectTrigger className={classNames?.input}>
                                                    <SelectValue
                                                        placeholder={localization.noExpiration}
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none">
                                                    {localization.noExpiration}
                                                </SelectItem>

                                                {[1, 7, 30, 60, 90, 180, 365].map((days) => (
                                                    <SelectItem key={days} value={days.toString()}>
                                                        {days === 365
                                                            ? `1 ${localization.year}`
                                                            : `${days} ${days === 1 ? localization.day : localization.days}`}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className={classNames?.dialog?.footer}>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange?.(false)}
                                className={cn(classNames?.button, classNames?.outlineButton)}
                                disabled={isSubmitting}
                            >
                                {localization.cancel}
                            </Button>

                            <Button
                                type="submit"
                                variant="default"
                                className={cn(classNames?.button, classNames?.primaryButton)}
                                disabled={isSubmitting}
                            >
                                {isSubmitting && <Loader2 className="animate-spin" />}

                                {localization.create}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
