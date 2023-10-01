import { dictionaries, dictionaries as dictionaryStore } from "../Store"
import { dictionary, dictionarySchema } from "../ZodSchemas/dictionary"
import { backupData } from "../ZodSchemas/exportdata"
import { DictionaryController } from "./Dictionary"

export class DictionariesController {
    static get defaultDictionaryName() {
        return dictionaryStore.get("defaultDictionary")
    }

    static get defaultDictionary() {
        const dictionaries = dictionaryStore.get("dictionaries")

        const defaultName = this
            .defaultDictionaryName as keyof typeof dictionaries

        const defaultDictionary = dictionaries.find(
            (dictionary) => dictionary.name === defaultName,
        )

        if (!defaultDictionary) {
            throw new Error("Dicionário padrão não encontrado")
        }

        return new DictionaryController(defaultDictionary)
    }

    static get dictionaries() {
        return dictionaryStore.get("dictionaries")
    }

    static get dictionariesNames() {
        return this.dictionaries.map((dictionary) => dictionary.name)
    }

    static exists(name: string) {
        try {
            this.getDictionary(name)
            return true
        } catch (err) {
            return false
        }
    }

    static getDictionary(name: string) {
        const { dictionaries } = this

        const dictionary = dictionaries.find(
            (dictionary) => dictionary.name === name,
        )

        if (!dictionary) {
            throw new Error("Dicionário não encontrado")
        }

        return new DictionaryController(dictionary)
    }

    static saveDictionary(dictionary: dictionary) {
        const dictionaries = dictionaryStore.get("dictionaries")

        const index = dictionaries.findIndex((d) => d.name === dictionary.name)

        if (index === -1) {
            throw new Error("Dicionário não encontrado")
        }

        dictionaries[index] = dictionary

        dictionaryStore.set("dictionaries", dictionaries)
    }

    static addDictionary(name: string, setDefault = false) {
        const dictionaries = dictionaryStore.get("dictionaries")

        const hasDictionary = dictionaries.some(
            (dictionary) => dictionary.name === name,
        )

        if (hasDictionary) {
            throw new Error("Já existe um dicionário com esse nome")
        }

        if (!name) {
            throw new Error("Nome inválido")
        }

        dictionaries.push(dictionarySchema.parse({ name, words: [] }))

        dictionaryStore.set("dictionaries", dictionaries)

        if (setDefault) {
            dictionaryStore.set("defaultDictionary", name)
        }
    }

    static editDictionary(
        name: string,
        {
            newName,
            setDefault,
            languages,
        }: { newName?: string; setDefault?: boolean; languages?: string[] },
    ) {
        const dictionaries = dictionaryStore.get("dictionaries")

        const index = dictionaries.findIndex(
            (dictionary) => dictionary.name === name,
        )

        if (index === -1) {
            throw new Error("Dicionário não encontrado")
        }

        if (newName && newName !== name) {
            const hasDictionary = dictionaries.some(
                (dictionary) => dictionary.name === newName,
            )

            if (hasDictionary) {
                throw new Error("Já existe um dicionário com esse nome")
            }

            dictionaries[index].name = newName
        }

        if (languages) {
            dictionaries[index].languages = languages
        }

        dictionaryStore.set("dictionaries", dictionaries)

        const editingDefault = this.defaultDictionaryName === name
        if (setDefault || editingDefault) {
            dictionaryStore.set("defaultDictionary", newName ?? name)
        }
    }

    static removeDictionary(name: string) {
        if (this.defaultDictionary.name === name) {
            throw new Error("Não é possível remover o dicionário padrão")
        }

        const dictionaries = dictionaryStore
            .get("dictionaries")
            .filter((dictionary) => dictionary.name !== name)

        dictionaryStore.set("dictionaries", dictionaries)
    }

    static importData(data: backupData, action: "merge" | "replace") {
        const { dictionariesNames } = this

        if (action === "merge") {
            for (const dictionary of data.dictionaries) {
                if (dictionariesNames.includes(dictionary.name)) {
                    this.mergeDictionary(dictionary)
                } else {
                    this.importDictionary(dictionary)
                }
            }
        }

        if (action === "replace") {
            dictionaries.store = data
        }
    }

    static importDictionary(dicionary: dictionary) {
        const dictionaries = dictionaryStore.get("dictionaries")

        const names = dictionaries.map((dictionary) => dictionary.name)

        if (names.includes(dicionary.name)) {
            throw new Error("Já existe um dicionário com esse nome")
        }

        dictionaries.push(dicionary)

        dictionaryStore.set("dictionaries", dictionaries)
    }

    static mergeDictionary(dictionary: dictionary) {
        const currentDictionary = DictionariesController.getDictionary(
            dictionary.name,
        )

        currentDictionary.Words.mergeWords(dictionary.words)
    }
}
