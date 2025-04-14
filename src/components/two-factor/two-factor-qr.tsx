"use client";

import { QRCodeSVG } from "qrcode.react";
import { useContext, useEffect, useState } from "react";
import type { AuthLocalization } from "../../lib/auth-localization";
import { AuthUIContext } from "../../lib/auth-ui-provider";
import { cn } from "../../lib/utils";
import { Skeleton } from "../ui/skeleton";

interface TwoFactorQRProps {
  uri: string;
  size?: number;
  className?: string;
  /**
   * @default authLocalization
   * @remarks `AuthLocalization`
   */
  localization?: Partial<AuthLocalization>;
}

export function TwoFactorQR({
  uri,
  size = 200,
  className,
  localization: propLocalization,
}: TwoFactorQRProps) {
  const [mounted, setMounted] = useState(false);
  const { localization: authLocalization } = useContext(AuthUIContext);
  const localization = { ...authLocalization, ...propLocalization };

  useEffect(() => {
    setMounted(true);
  }, [uri]);

  // If URI is empty, display an error message
  if (!uri) {
    return (
      <div className={cn("w-full max-w-[240px] mx-auto", className)}>
        <div className="flex items-center justify-center text-center p-4 mx-auto">
          <div className="text-destructive text-sm">
            {localization.qrCodeMissing}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex justify-center items-center w-full", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        {!mounted ? (
          <Skeleton className="h-full w-full rounded-md" />
        ) : (
          <QRCodeSVG
            value={uri}
            size={size}
            level="H"
            fgColor="currentColor"
            bgColor="transparent"
            className="mx-auto"
          />
        )}
      </div>
    </div>
  );
}
