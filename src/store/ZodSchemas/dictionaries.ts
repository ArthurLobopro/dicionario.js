import z from "zod"
import { dictionarySchema, systemLanguage } from "./dictionary"

export const dictionariesSchema = z.object({
    dictionaries: z.array(dictionarySchema).default([
        {
            name: "Dicionário Padrão",
            words: [],
            languages: [systemLanguage],
        },
    ]),
    defaultDictionary: z.string().default("Dicionário Padrão"),
})

export type StoreDictionaries = z.infer<typeof dictionariesSchema>
