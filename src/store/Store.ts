import ZodElectronStore from "zod-electron-store"
import { DictionariesMigrations, WordsMigrations } from "./Migrations"
import { StoreDictionaries, dictionariesSchema } from "./ZodSchemas/dictionaries"
import { StoreOptions, optionsSchema } from "./ZodSchemas/options"
import { StoreWords, wordsSchema } from "./ZodSchemas/word"

export const data = new ZodElectronStore<StoreWords>({
    name: "data",
    watch: true,
    schema: wordsSchema,
    //@ts-ignore
    migrations: WordsMigrations,
})

export const options = new ZodElectronStore<StoreOptions>({
    name: "options",
    watch: true,
    schema: optionsSchema
})

export const dictionaries = new ZodElectronStore<StoreDictionaries>({
    schema: dictionariesSchema,
    name: "dictionaries",
    //@ts-ignore
    migrations: DictionariesMigrations
})