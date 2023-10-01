import { dictionariesStore } from "../Store"
import { dictionary } from "../ZodSchemas/dictionary"
import { backupData } from "../ZodSchemas/exportdata"
import { DictionariesController } from "./Dictionaries"

export class DataImporter {
    static importData(data: backupData, action: "merge" | "replace") {
        const dictionariesNames = DictionariesController.dictionariesNames

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
            dictionariesStore.store = data
        }
    }

    static mergeDictionary(dictionary: dictionary) {
        const currentDictionary = DictionariesController.getDictionary(
            dictionary.name,
        )

        currentDictionary.Words.mergeWords(dictionary.words)
    }

    static importDictionary(dicionary: dictionary) {
        const dictionaries = dictionariesStore.get("dictionaries")

        const names = dictionaries.map((dictionary) => dictionary.name)

        if (names.includes(dicionary.name)) {
            throw new Error("Já existe um dicionário com esse nome")
        }

        dictionaries.push(dicionary)

        dictionariesStore.set("dictionaries", dictionaries)
    }
}
