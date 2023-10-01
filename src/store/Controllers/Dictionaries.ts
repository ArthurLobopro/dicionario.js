import { dictionariesStore } from "../Store"
import { dictionary, dictionarySchema } from "../ZodSchemas/dictionary"
import { DictionaryController } from "./Dictionary"

export class DictionariesController {
    static get defaultDictionaryName() {
        return dictionariesStore.get("defaultDictionary")
    }

    static get defaultDictionary() {
        const dictionaries = dictionariesStore.get("dictionaries")

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
        return dictionariesStore.get("dictionaries")
    }

    static get dictionariesNames() {
        return this.dictionaries.map((dictionary) => dictionary.name)
    }

    static exists(name: string) {
        return dictionariesStore
            .get("dictionaries")
            .some((dictionary) => dictionary.name === name)
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
        const dictionaries = dictionariesStore.get("dictionaries")

        const index = dictionaries.findIndex((d) => d.name === dictionary.name)

        if (index === -1) {
            throw new Error("Dicionário não encontrado")
        }

        dictionaries[index] = dictionary

        dictionariesStore.set("dictionaries", dictionaries)
    }

    static addDictionary(name: string, setDefault = false) {
        if (!name) {
            throw new Error("Nome inválido")
        }

        const hasDictionary = this.exists(name)

        if (hasDictionary) {
            throw new Error("Já existe um dicionário com esse nome")
        }

        const dictionaries = dictionariesStore.get("dictionaries")
        dictionaries.push(dictionarySchema.parse({ name, words: [] }))
        dictionariesStore.set("dictionaries", dictionaries)

        if (setDefault) {
            dictionariesStore.set("defaultDictionary", name)
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
        const dictionaries = dictionariesStore.get("dictionaries")

        const index = dictionaries.findIndex(
            (dictionary) => dictionary.name === name,
        )

        if (index === -1) {
            throw new Error("Dicionário não encontrado")
        }

        if (newName && newName !== name) {
            const hasDictionary = this.exists(newName)

            if (hasDictionary) {
                throw new Error("Já existe um dicionário com esse nome")
            }

            dictionaries[index].name = newName
        }

        if (languages) {
            dictionaries[index].languages = languages
        }

        dictionariesStore.set("dictionaries", dictionaries)

        const editingDefault = this.defaultDictionaryName === name
        if (setDefault || editingDefault) {
            dictionariesStore.set("defaultDictionary", newName ?? name)
        }
    }

    static removeDictionary(name: string) {
        if (this.defaultDictionary.name === name) {
            throw new Error("Não é possível remover o dicionário padrão")
        }

        const dictionaries = dictionariesStore
            .get("dictionaries")
            .filter((dictionary) => dictionary.name !== name)

        dictionariesStore.set("dictionaries", dictionaries)
    }
}
