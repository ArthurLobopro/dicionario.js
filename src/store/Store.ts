/* eslint-disable @typescript-eslint/ban-ts-comment */

import ZodElectronStore from "zod-electron-store"
import { DictionariesMigrations, WordsMigrations } from "./Migrations"
import {
    StoreDictionaries,
    dictionariesSchema,
} from "./ZodSchemas/dictionaries"
import { StoreWords, wordsSchema } from "./ZodSchemas/word"

export const data = new ZodElectronStore<StoreWords>({
    name: "data",
    watch: true,
    schema: wordsSchema,
    // @ts-ignore
    migrations: WordsMigrations,
})

export const dictionariesStore = new ZodElectronStore<StoreDictionaries>({
    schema: dictionariesSchema,
    name: "dictionaries",
    // @ts-ignore
    migrations: DictionariesMigrations,
})
