import { StoreWord, dictionary } from "../Schemas"
import { dictionaries as dictionaryStore } from "../Store"
import { DictionaryController } from "./Dictionary"

export class DictionariesController {
    static getDefaultDictionary() {
        const dictionaries = dictionaryStore.get("dictionaries")

        const defaultName = dictionaryStore.get("defaultDictionary") as keyof typeof dictionaries

        const defaultDictionary = dictionaries.find(dictionary => dictionary.name === defaultName)

        if (!defaultDictionary) {
            throw new Error("Default dictionary not found")
        }

        return new DictionaryController(defaultDictionary)
    }

    static getDictionary(name: string) {
        const dictionaries = dictionaryStore.get("dictionaries")

        const dictionary = dictionaries.find(dictionary => dictionary.name === name)

        if (!dictionary) {
            throw new Error("Dictionary not found")
        }

        return new DictionaryController(dictionary)
    }

    static getDictionaries() {
        return dictionaryStore.get("dictionaries")
    }

    static getDictionariesNames() {
        return dictionaryStore.get("dictionaries").map(dictionary => dictionary.name)
    }

    static saveDictionary(dictionary: dictionary) {
        const dictionaries = dictionaryStore.get("dictionaries")

        const index = dictionaries.findIndex(d => d.name === dictionary.name)

        if (index === -1) {
            throw new Error("Dictionary not found")
        }

        dictionaries[index] = dictionary

        dictionaryStore.set("dictionaries", dictionaries)
    }
}