"use client"

import { CheckIcon, CopyIcon } from "lucide-react"
import { type ComponentProps, useContext, useState } from "react"

import { AuthUIContext } from "../../../lib/auth-ui-provider"
import { cn } from "../../../lib/utils"
import { Button } from "../../ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "../../ui/dialog"
import type { SettingsCardClassNames } from "../shared/settings-card"
interface BackupCodesDialogProps extends ComponentProps<typeof Dialog> {
    classNames?: SettingsCardClassNames
    backupCodes: string[]
}

export function BackupCodesDialog({
    classNames,
    onOpenChange,
    backupCodes,
    ...props
}: BackupCodesDialogProps) {
    const { localization } = useContext(AuthUIContext)
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        const codeText = backupCodes.join("\n")
        navigator.clipboard.writeText(codeText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Dialog onOpenChange={onOpenChange} {...props}>
            <DialogContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                className={classNames?.dialog?.content}
            >
                <DialogHeader className={classNames?.dialog?.header}>
                    <DialogTitle className={cn("text-lg md:text-xl", classNames?.title)}>
                        {localization.backupCodes}
                    </DialogTitle>

                    <DialogDescription
                        className={cn("text-xs md:text-sm", classNames?.description)}
                    >
                        {localization.backupCodesDescription}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-2">
                    {backupCodes.map((code, index) => (
                        <div
                            key={index}
                            className="rounded-md bg-muted p-2 text-center font-mono text-sm"
                        >
                            {code}
                        </div>
                    ))}
                </div>

                <DialogFooter className={classNames?.dialog?.footer}>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCopy}
                        disabled={copied}
                        className={classNames?.button}
                    >
                        {copied ? (
                            <>
                                <CheckIcon />
                                {localization.copiedToClipboard}
                            </>
                        ) : (
                            <>
                                <CopyIcon />
                                {localization.copyAllCodes}
                            </>
                        )}
                    </Button>

                    <Button
                        type="button"
                        variant="default"
                        onClick={() => onOpenChange?.(false)}
                        className={cn(classNames?.button, classNames?.primaryButton)}
                    >
                        {localization.continue}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
