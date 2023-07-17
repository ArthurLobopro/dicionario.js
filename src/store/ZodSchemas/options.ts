import z from "zod"

export const optionsSchema = z.object({
    darkMode: z.boolean().default(true),
    animations: z.boolean().default(true),
    frameStyle: z.enum(["windows", "macos"]).default("windows"),
    frameTheme: z.enum(["light", "dark", "auto"]).default("auto"),
    linux: z
        .object({
            useSystemTitleBar: z.boolean().default(false),
        })
        .default({
            useSystemTitleBar: false,
        }),
})

export type StoreOptions = z.infer<typeof optionsSchema>
