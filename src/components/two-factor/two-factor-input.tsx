"use client"

import { useEffect, useRef } from "react"
import { cn } from "../../lib/utils"
import { Input } from "../ui/input"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp"

interface TwoFactorInputProps {
    value: string
    onChange: (value: string) => void
    maxLength?: number
    placeholder?: string
    className?: string
    id?: string
    name?: string
    onComplete?: () => void
    /**
     * Whether this is a backup code input (uses standard input instead of OTP)
     * @default false
     */
    isBackupCode?: boolean
}

export function TwoFactorInput({
    id,
    name,
    value,
    onChange,
    maxLength = 6,
    placeholder,
    className,
    onComplete,
    isBackupCode = false
}: TwoFactorInputProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const hasCompletedRef = useRef(false)

    // Focus the input on mount
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

    // Call onComplete when the code is fully entered
    useEffect(() => {
        if (value.length === maxLength && onComplete && !hasCompletedRef.current) {
            hasCompletedRef.current = true
            onComplete()
        } else if (value.length < maxLength) {
            hasCompletedRef.current = false
        }
    }, [value, maxLength, onComplete])

    // For backup codes, use a standard input
    if (isBackupCode) {
        return (
            <div className={cn("w-full", className)}>
                <Input
                    ref={inputRef}
                    id={id}
                    name={name}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value)
                    }}
                    maxLength={maxLength}
                    placeholder={placeholder}
                    className="text-center font-mono"
                    autoComplete="one-time-code"
                    autoCapitalize="off"
                    spellCheck="false"
                    onKeyDown={(e) => {
                        if (
                            e.key === "Enter" &&
                            value.length === maxLength &&
                            onComplete &&
                            !hasCompletedRef.current
                        ) {
                            hasCompletedRef.current = true
                            onComplete()
                        }
                    }}
                />
            </div>
        )
    }

    // For TOTP codes, use InputOTP
    return (
        <div className={cn("flex w-full justify-center", className)}>
            <InputOTP
                ref={inputRef}
                maxLength={maxLength}
                value={value}
                onChange={(newValue) => {
                    onChange(newValue)
                }}
                id={id}
                name={name}
                autoComplete="one-time-code"
            >
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
            </InputOTP>
        </div>
    )
}
