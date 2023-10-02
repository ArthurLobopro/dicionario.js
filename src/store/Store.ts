/* eslint-disable @typescript-eslint/ban-ts-comment */

import ZodElectronStore from "zod-electron-store"
import { WordsMigrations } from "./Migrations"
import { StoreWords, wordsSchema } from "./ZodSchemas/word"

export const data = new ZodElectronStore<StoreWords>({
    name: "data",
    watch: true,
    schema: wordsSchema,
    // @ts-ignore
    migrations: WordsMigrations,
})
