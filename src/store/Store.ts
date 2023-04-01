import ElectronStore from 'electron-store'
import { StoreOptions, StoreWord, optionsSchema, wordsSchema } from "./Schemas"
import { WordsMigrations } from "./Migrations"

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
// data.get("words") ? null : data.store.words = []