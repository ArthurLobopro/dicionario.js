import z from "zod"
import { dictionarySchema } from "./dictionary"

export const dictionariesSchema = z.object({
    dictionaries: z.array(dictionarySchema).default([]),
    defaultDictionary: z.string().default("Dicionário Padrão"),
})

export type StoreDictionaries = z.infer<typeof dictionariesSchema>
