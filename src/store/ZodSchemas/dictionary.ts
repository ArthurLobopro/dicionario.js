import { app, ipcRenderer } from "electron"
import { z } from "zod"
import { wordSchema } from "./word"

const systemLanguage = (() => {
    if (app) {
        return app.getLocale()
    }

    return ipcRenderer.sendSync("get-system-language") as string
})()

export const dictionarySchema = z.object({
    name: z.string(),
    words: z.array(wordSchema),
    languages: z
        .array(z.string())
        .default([systemLanguage])
        .transform((value) => value.filter((v) => v.length)),
})

export type dictionary = z.infer<typeof dictionarySchema>
