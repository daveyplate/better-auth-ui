"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { type ComponentProps, useContext, useMemo } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { AuthUIContext } from "../../lib/auth-ui-provider"
import { cn, getLocalizedError } from "../../lib/utils"
import type { AuthLocalization } from "../../localization/auth-localization"
import type { SettingsCardClassNames } from "../settings/shared/settings-card"
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "../ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "../ui/form"
import { Input } from "../ui/input"

export interface CreateTeamDialogProps extends ComponentProps<typeof Dialog> {
    className?: string
    classNames?: SettingsCardClassNames
    localization?: AuthLocalization
    organizationId?: string
}

export function CreateTeamDialog({
    className,
    classNames,
    localization: localizationProp,
    organizationId,
    onOpenChange,
    ...props
}: CreateTeamDialogProps) {
    const {
        authClient,
        localization: contextLocalization,
        toast
    } = useContext(AuthUIContext)

    const localization = useMemo(
        () => ({ ...contextLocalization, ...localizationProp }),
        [contextLocalization, localizationProp]
    )

    const formSchema = z.object({
        name: z
            .string()
            .min(1, {
                message: `${localization.TEAM_NAME} ${localization.IS_REQUIRED}`
            })
            .max(64, {
                message: localization.TEAM_NAME_INSTRUCTIONS
            })
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    })

    const isSubmitting = form.formState.isSubmitting

	async function onSubmit({ name }: z.infer<typeof formSchema>) {
		try {
			await authClient.$fetch("/organization/create-team", {
				method: "POST",
				body: {
					name,
					organizationId
				},
				throw: true
			})

			onOpenChange?.(false)
			form.reset()

			toast({
				variant: "success",
				message: localization.CREATE_TEAM_SUCCESS
			})
		} catch (error) {
			toast({
				variant: "error",
				message: getLocalizedError({ error, localization })
			})
		}
	}

    return (
        <Dialog onOpenChange={onOpenChange} {...props}>
            <DialogContent className={classNames?.dialog?.content}>
                <DialogHeader className={classNames?.dialog?.header}>
                    <DialogTitle
                        className={cn("text-lg md:text-xl", classNames?.title)}
                    >
                        {localization.CREATE_TEAM}
                    </DialogTitle>

                    <DialogDescription
                        className={cn(
                            "text-xs md:text-sm",
                            classNames?.description
                        )}
                    >
                        {localization.TEAM_NAME_DESCRIPTION}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {localization.TEAM_NAME}
                                    </FormLabel>

                                    <FormControl>
                                        <Input
                                            placeholder={
                                                localization.TEAM_NAME_PLACEHOLDER
                                            }
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className={classNames?.dialog?.footer}>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange?.(false)}
                                className={cn(
                                    classNames?.button,
                                    classNames?.outlineButton
                                )}
                            >
                                {localization.CANCEL}
                            </Button>

                            <Button
                                type="submit"
                                className={cn(
                                    classNames?.button,
                                    classNames?.primaryButton
                                )}
                                disabled={isSubmitting}
                            >
                                {isSubmitting && (
                                    <Loader2 className="animate-spin" />
                                )}

                                {localization.CREATE_TEAM}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
