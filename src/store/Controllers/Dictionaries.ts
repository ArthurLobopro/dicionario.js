import { ipcRenderer } from "electron"
import * as fs from "node:fs"
import * as path from "node:path"
import { dictionary } from "../Schemas"
import { dictionaries as dictionaryStore } from "../Store"
import { DictionaryController } from "./Dictionary"

export class DictionariesController {
    static getDefaultDictionary() {
        const dictionaries = dictionaryStore.get("dictionaries")

        const defaultName = dictionaryStore.get("defaultDictionary") as keyof typeof dictionaries

        const defaultDictionary = dictionaries.find(dictionary => dictionary.name === defaultName)

        if (!defaultDictionary) {
            throw new Error("Dicionário padrão não encontrado")
        }

        return new DictionaryController(defaultDictionary)
    }

    static getDictionary(name: string) {
        const dictionaries = dictionaryStore.get("dictionaries")

        const dictionary = dictionaries.find(dictionary => dictionary.name === name)

        if (!dictionary) {
            throw new Error("Dicionário não encontrado")
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
            throw new Error("Dicionário não encontrado")
        }

        dictionaries[index] = dictionary

        dictionaryStore.set("dictionaries", dictionaries)
    }

    static addDictionary(name: string, setDefault: boolean = false) {
        const dictionaries = dictionaryStore.get("dictionaries")

        const hasDictionary = dictionaries.some(dictionary => dictionary.name === name)

        if (hasDictionary) {
            throw new Error("Já existe um dicionário com esse nome")
        }

        dictionaries.push({
            name,
            words: []
        })

        dictionaryStore.set("dictionaries", dictionaries)

        if (setDefault) {
            dictionaryStore.set("defaultDictionary", name)
        }
    }

    static editDictionary(oldName: string, { newName, setDefault }: { newName: string, setDefault: boolean }) {
        const dictionaries = dictionaryStore.get("dictionaries")

        const index = dictionaries.findIndex(dictionary => dictionary.name === oldName)

        if (index === -1) {
            throw new Error("Dicionário não encontrado")
        }

        dictionaries[index].name = newName

        dictionaryStore.set("dictionaries", dictionaries)

        if (setDefault) {
            dictionaryStore.set("defaultDictionary", newName)
        }
    }

    static removeDictionary(name: string) {
        const dictionaries = dictionaryStore.get("dictionaries").filter(dictionary => dictionary.name !== name)

        dictionaryStore.set("dictionaries", dictionaries)
    }

    static exportDictionary(name: string, folder: string) {
        const dictionary = DictionariesController.getDictionary(name)

        const content = dictionary.export()

        const exportName = name.replace(/ /g, "_").toLowerCase()
        const currentDateTime = new Date()
            .toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            })
            .replace(/\//g, "-")
            .replace(/, /g, "_")
            .replace(/:/g, "-")

        const filePath = path.resolve(folder, `${exportName}_${currentDateTime}.json`)

        fs.writeFileSync(filePath, content)
    }

    static importDictionary(dicionary: dictionary) {
        const dictionaries = dictionaryStore.get("dictionaries")

        const names = dictionaries.map(dictionary => dictionary.name)

        if (names.includes(dicionary.name)) {
            throw new Error("Já existe um dicionário com esse nome")
        }

        dictionaries.push(dicionary)

        dictionaryStore.set("dictionaries", dictionaries)

    }

    static mergeDictionary(dictionary: dictionary) {
        const current_dictionary = DictionariesController.getDictionary(dictionary.name)

        current_dictionary.Words.mergeWords(dictionary.words)
    }
}