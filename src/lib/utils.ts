import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getURL = () => {
    const url =
        (process.env.NEXT_PUBLIC_STATIC_EXPORT == "true" ? process.env.NEXT_PUBLIC_BASE_URL :
            process.env.NEXT_PUBLIC_SITE_URL || // Set this to your site URL in production env.
            process.env.NEXT_PUBLIC_VERCEL_URL) || // Automatically set by Vercel.
        "http://localhost:3000"

    // Make sure to include `https://` when not localhost.
    return url.includes("http") ? url : `https://${url}`
}