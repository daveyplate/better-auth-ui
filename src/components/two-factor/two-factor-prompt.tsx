"use client";

import { AlertCircle, Info } from "lucide-react";
import { useState } from "react";
import { AuthLocalization } from "../../lib/auth-localization";
import { cn } from "../../lib/utils";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { TwoFactorInput } from "./two-factor-input";

export interface TwoFactorPromptProps {
  error?: string;
  isSubmitting?: boolean;
  onSubmit: (code: string, trustDevice: boolean) => void;
  onBackupCodeToggle?: (isBackupCode: boolean) => void;
  localization: AuthLocalization;
  className?: string;
  isSetup?: boolean;
}

export const TwoFactorPrompt = ({
  error,
  isSubmitting,
  onSubmit,
  onBackupCodeToggle,
  localization,
  className,
  isSetup = false,
}: TwoFactorPromptProps) => {
  const [code, setCode] = useState("");
  const [trustDevice, setTrustDevice] = useState(false);
  const [isBackupCode, setIsBackupCode] = useState(false);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (newCode.length === (isBackupCode ? 11 : 6)) {
      onSubmit(newCode, trustDevice);
    }
  };

  const toggleBackupCode = () => {
    const newIsBackupCode = !isBackupCode;
    setIsBackupCode(newIsBackupCode);
    setCode("");
    onBackupCodeToggle?.(newIsBackupCode);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2">
        {!isSetup && (
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleBackupCode}
              className="text-xs"
            >
              {isBackupCode
                ? localization.useTwoFactorCode
                : localization.useBackupCode}
            </Button>
          </div>
        )}

        {isBackupCode && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>{localization.enterBackupCode}</AlertTitle>
            <AlertDescription>
              {localization.backupCodePlaceholder}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <TwoFactorInput
          value={code}
          onChange={handleCodeChange}
          maxLength={isBackupCode ? 11 : 6}
          isBackupCode={isBackupCode}
        />

        <div className="flex items-center space-x-2">
          <Checkbox
            id="trust-device"
            checked={trustDevice}
            onCheckedChange={(checked: boolean) => setTrustDevice(checked)}
            disabled={isSubmitting}
          />
          <Label
            htmlFor="trust-device"
            className="text-sm text-muted-foreground"
          >
            {localization.rememberDevice}
          </Label>
        </div>
      </div>
    </div>
  );
};
