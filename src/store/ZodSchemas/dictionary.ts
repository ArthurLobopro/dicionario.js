import { z } from "zod"
import { wordSchema } from "./word"

export const dictionarySchema = z.object({
    name: z.string(),
    words: z.array(wordSchema),
})

export type dictionary = z.infer<typeof dictionarySchema>
