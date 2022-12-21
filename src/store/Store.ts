import ElectronStore from 'electron-store'
import { StoreOptions, StoreWord, optionsSchema, wordsSchema } from "./Schemas"

export const data = new ElectronStore<{ palavras: StoreWord[] }>({
    name: "data",
    watch: true,
    schema: wordsSchema
})

export const options = new ElectronStore<StoreOptions>({
    name: "options",
    watch: true,
    schema: optionsSchema
})

data.get("palavras") ? null : data.store.palavras = []