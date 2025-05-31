import type { ReactNode } from "react"

export type FieldType = "string" | "number" | "boolean" | "select"

type BaseField = {
    description?: ReactNode
    instructions?: ReactNode
    label: ReactNode
    placeholder?: string
    required?: boolean
    validate?: (value: string) => Promise<boolean>
}

export type AdditionalField =
    | (BaseField & { type: "string" | "number" | "boolean" })
    | (BaseField & {
          type: "select"
          options: { label: string; value: string }[]
      })

export interface AdditionalFields {
    [key: string]: AdditionalField
}
