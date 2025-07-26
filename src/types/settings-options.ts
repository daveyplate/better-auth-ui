export type SettingsOptions = {
    /**
     * Custom Settings URL
     */
    url?: string
    /**
     * Base path for settings views
     */
    basePath?: string
    /**
     * Array of fields to show in `<SettingsCards />`
     * @default ["image", "name"]
     */
    fields: string[]
}
