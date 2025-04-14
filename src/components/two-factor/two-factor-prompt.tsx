"use client";

import { useContext, useEffect, useRef, useState } from "react";
import type { AuthLocalization } from "../../lib/auth-localization";
import { AuthUIContext } from "../../lib/auth-ui-provider";
import { cn } from "../../lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { TwoFactorInput } from "./two-factor-input";

interface TwoFactorPromptProps {
  className?: string;
  defaultValue?: string;
  error?: string;
  isSubmitting?: boolean;
  /**
   * @default authLocalization
   * @remarks `AuthLocalization`
   */
  localization?: Partial<AuthLocalization>;
  onSubmit?: (code: string, trustDevice: boolean) => void;
}

export function TwoFactorPrompt({
  className,
  defaultValue = "",
  error,
  isSubmitting = false,
  localization: propLocalization,
  onSubmit,
}: TwoFactorPromptProps) {
  const [code, setCode] = useState(defaultValue);
  const [trustDevice, setTrustDevice] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const { localization: authLocalization } = useContext(AuthUIContext);
  const localization = { ...authLocalization, ...propLocalization };

  // Reset code when error occurs
  useEffect(() => {
    if (error) {
      console.log("TwoFactorPrompt - Erreur reçue:", error);
      setCode("");
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      "TwoFactorPrompt - Soumission du formulaire, code:",
      code,
      "trustDevice:",
      trustDevice
    );
    onSubmit?.(code, trustDevice);
  };

  // Auto-submit when code reaches 6 characters
  const handleCodeChange = (newCode: string) => {
    console.log("TwoFactorPrompt - Changement de code:", newCode);
    setCode(newCode);
    if (newCode.length === 6 && !isSubmitting && formRef.current) {
      console.log("TwoFactorPrompt - Code complet, soumission automatique");
      formRef.current.requestSubmit();
    }
  };

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader>
        <CardTitle>{localization.twoFactorPrompt}</CardTitle>
        <CardDescription>
          {localization.twoFactorPromptDescription}
        </CardDescription>
      </CardHeader>
      <form ref={formRef} onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="twoFactorCode">
                {localization.enterTwoFactorCode}
              </Label>
              <TwoFactorInput
                id="twoFactorCode"
                value={code}
                onChange={handleCodeChange}
                placeholder={localization.twoFactorCodePlaceholder}
                maxLength={6}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="trustDevice"
                checked={trustDevice}
                onCheckedChange={(checked) => {
                  console.log(
                    "TwoFactorPrompt - Changement de trustDevice:",
                    checked
                  );
                  setTrustDevice(checked === true);
                }}
              />
              <Label htmlFor="trustDevice" className="text-sm font-normal">
                {localization.rememberDevice}
              </Label>
            </div>
          </div>
        </CardContent>
        {isSubmitting && (
          <CardFooter>
            <div className="w-full text-center text-sm text-muted-foreground">
              {localization.verifying}
            </div>
          </CardFooter>
        )}
      </form>
    </Card>
  );
}
