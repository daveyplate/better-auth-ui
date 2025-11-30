export type AuthToast = (
  message?: string,
  options?: { action?: { label: string; onClick: () => Promise<void> | void } }
) => string | number | unknown

export const defaultToast: AuthToast = (message, options) => {
  if (options?.action) {
    if (confirm(message)) {
      options.action.onClick()
    }
  } else {
    alert(message)
  }
}
