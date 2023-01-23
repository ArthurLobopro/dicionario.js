import ajv from "ajv"
import ajvFormats from "ajv-formats"
import { ipcRenderer } from "electron"
import fs from "node:fs"
import path from "node:path"
import { StoreWord, wordsSchema } from "../Schemas"
import { data } from "../Store"

type words = {
    [s: string]: {
        definition: string
        register: Date
        lastEdit?: Date
    }
}

function GetDateToSave() {
    const now = new Date()
    const day = String(now.getDate()).padStart(2, "0")
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const year = now.getFullYear()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    return `${day}-${month}-${year}_${hours}-${minutes}`
}

export class WordsController {

    static SortWords(words: words) {
        return Object.fromEntries(Object.entries(words).sort((a, b) => {
            return a[0].localeCompare(b[0])
        }))
    }

    static GetWords() {
        return Object.fromEntries(data.get("words").map(word => {
            const { definition, register, lastEdit = null } = word
            return [
                word.word,
                {
                    definition,
                    register: new Date(register),
                    ...(lastEdit ? {
                        lastEdit: new Date(word.lastEdit as string)
                    } : {})
                }
            ]
        }))
    }

    static GetWordsToSave(words: words) {
        return Object.entries(WordsController.SortWords(words))
            .map(([word, { definition, register, lastEdit = null }]) => {
                return {
                    word,
                    definition,
                    register: register.toISOString(),
                    ...(lastEdit && { lastEdit: lastEdit.toISOString() })
                }
            })
    }

    static SaveWord({ word, definition }: { word: string, definition: string }) {
        word = word.trim().toLowerCase()

        const words = WordsController.GetWords()

        if (word in words) {
            throw new Error(`A palavra ${word} já existe!`)
        }

        words[word] = {
            definition,
            register: new Date()
        }

        data.set("words", WordsController.GetWordsToSave(words))
    }

    static UpdateWord(word: string, { newWord, definition }: { newWord: string, definition: string }) {
        newWord = newWord.trim().toLowerCase()

        const words = WordsController.GetWords()

        if (!(word in words)) {
            throw new Error("Palavra não encontrada")
        }

        if (word !== newWord) {
            if (newWord in words) {
                throw new Error("Palavra já existe")
            }

            const new_word = words[word]
            delete words[word]
            words[newWord] = {
                ...new_word,
                definition,
                lastEdit: new Date()
            }
        } else {
            words[word] = {
                ...words[word],
                definition,
                lastEdit: new Date()
            }
        }

        data.set("words", WordsController.GetWordsToSave(words))
    }

    static DeleteWord(word: string) {
        const words = WordsController.GetWords()

        if (!(word in words)) {
            throw new Error("Palavra não encontrada")
        }

        delete words[word]

        data.set("words", WordsController.GetWordsToSave(words))
    }

    static DeleteDictionary() {
        data.set("words", [])
    }

    static ExportWords(wordList: string[]) {
        try {
            const folder = ipcRenderer.sendSync("get-folder")

            if (folder === "canceled") {
                return { status: "canceled" }
            }

            const filename = path.join(folder, `dicionario_${GetDateToSave()}.json`)

            const words = data.get("words").filter(word => wordList.includes(word.word))
            const json = JSON.stringify(words, null, 4)

            fs.writeFileSync(filename, json)

            return { status: "success" }
        } catch (error) {
            console.error(error)
            return { status: "error" }
        }
    }

    static ImportWords() {
        const file = ipcRenderer.sendSync("get-file")

        if (file === "canceled") {
            return { status: "canceled" }
        }

        const jsonString = fs.readFileSync(file).toString()
        const json = JSON.parse(jsonString)

        const validator = ajvFormats(new ajv({
            allErrors: true,
            strictRequired: true
        })).compile(wordsSchema.words)

        const valid = validator(json)

        if (valid) {
            WordsController.MergeWords(json as unknown as StoreWord[])
            return { status: "success" }
        } else {
            console.log(validator.errors)
            throw new Error("Arquivo de importação inválido")
        }
    }

    static MergeWords(words: StoreWord[]) {
        const store_keys = data.store.words.map(p => p.word)

        const new_words = data.store.words

        words.forEach(word => {
            if (!(word.word in store_keys)) {
                new_words.push(word)
            }
        })

        new_words.sort((a, b) => {
            return a.word.localeCompare(b.word)
        })

        data.set("words", new_words)
    }
}