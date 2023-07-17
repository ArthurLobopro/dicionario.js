import { z } from "zod"

export const wordSchema = z.object({
    word: z
        .string({ required_error: "Você deve fornecer uma palavra." })
        .trim()
        .min(2, "A palavra deve ter pelo menos 2 caracteres.")
        .transform((val) => val.toLowerCase()),

    definition: z
        .string()
        .trim()
        .min(5, "A definição deve conter com pelo menos 5 caracteres."),
    register: z.string().datetime(),
    lastEdit: z.string().datetime().optional(),
})

export const wordsSchema = z.object({
    words: z.array(wordSchema).default([]),
})

export type StoreWord = z.infer<typeof wordSchema>
export type StoreWords = z.infer<typeof wordsSchema>
