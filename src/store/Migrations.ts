import Store from "zod-electron-store"
import { data } from "./Store"
import { StoreDictionaries } from "./ZodSchemas/dictionaries"

type versions_types = {
    "1.8.1": {
        palavras: {
            palavra: string
            definicao: string
            registro: string
            ultimaEdicao?: string
        }[]
    }
    "1.10.0": {
        words: {
            word: string
            definition: string
            register: string
            lastEdit?: string
        }[]
    }
}

export const WordsMigrations = {
    "1.9.0": (store: Store<versions_types["1.8.1"]>) => {
        if (store.has("palavras") && store.get("palavras").length > 0) {
            const oldData = store.get("palavras")
            const newData = oldData.map((word) => {
                return {
                    word: word.palavra,
                    definition: word.definicao,
                    register: word.registro,
                    ...(word.ultimaEdicao && { lastEdit: word.ultimaEdicao }),
                }
            })
            store.delete("palavras")
            store.set("words", newData)
        }
    },
}

export const DictionariesMigrations = {
    "2.0.0": (store: Store<StoreDictionaries>) => {
        const dictionaries = store.get("dictionaries")
        const defaultName = store.get("defaultDictionary")

        const defaultDictionary = dictionaries.find(
            (dictionary) => dictionary.name === defaultName,
        )

        if (defaultDictionary && defaultDictionary.words.length === 0) {
            defaultDictionary.words = data.get("words")

            store.set(
                "dictionaries",
                dictionaries.map((dictionary) => {
                    if (dictionary.name === defaultName) {
                        return defaultDictionary
                    } else {
                        return dictionary
                    }
                }),
            )
        }
    },
}
