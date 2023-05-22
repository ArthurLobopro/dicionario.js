import ElectronStore from 'electron-store'
import { DictionariesMigrations, WordsMigrations } from "./Migrations"
import { StoreOptions, StoreWord, dictionariesSchema, optionsSchema, wordsSchema } from "./Schemas"

export const data = new ElectronStore<{ words: StoreWord[] }>({
    name: "data",
    watch: true,
    schema: wordsSchema,
    //@ts-ignore
    migrations: WordsMigrations,
})

export const options = new ElectronStore<StoreOptions>({
    name: "options",
    watch: true,
    schema: optionsSchema
})

export const dictionaries = new ElectronStore({
    schema: dictionariesSchema,
    name: "dictionaries",
    //@ts-ignore
    migrations: DictionariesMigrations
})