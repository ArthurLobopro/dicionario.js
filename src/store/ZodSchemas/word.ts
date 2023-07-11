import { z } from "zod"

export const wordSchema = z.object({
    word: z.string(),
    definition: z.string(),
    register: z.string().datetime(),
    lastEdit: z.string().datetime().optional(),
})

export const wordsSchema = z.object({
    words: z.array(wordSchema).default([]),
})

export type StoreWord = z.infer<typeof wordSchema>
export type StoreWords = z.infer<typeof wordsSchema>
