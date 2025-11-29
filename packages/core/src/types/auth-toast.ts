export type AuthToast = (
  message?: string,
  options?: { action?: { label: string; onClick: () => Promise<void> | void } }
) => string | number | unknown
