import { z } from "zod"

export const wordSchema = z.object({
    word: z.string(),
    definition: z.string(),
    register: z.string().datetime(),
    lastEdit: z.string().datetime().optional()
})