import ajv from "ajv"
import ajvFormats from "ajv-formats"
import { ipcRenderer } from "electron"
import fs from "node:fs"
import path from "node:path"
import { StoreWord, wordsSchema } from "../Schemas"
import { data } from "../Store"
import { z } from "zod"

type words = {
    [s: string]: {
        definition: string
        register: Date
        lastEdit?: Date
    }
}

const words_schema_v_1_8_1 = z.array(z.object({
    palavra: z.string(),
    definicao: z.string(),
    registro: z.string().datetime(),
    ultimaEdicao: z.string().datetime().optional()
}))

const words_schema = z.array(z.object({
    word: z.string(),
    definition: z.string(),
    register: z.string().datetime(),
    lastEdit: z.string().datetime().optional()
}))

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

    static GetWord(word: string) {
        return data.get("words")
            .find(value => value.word === word)
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

        const is_old_version = words_schema_v_1_8_1.safeParse(json)

        if (is_old_version.success) {
            const words = is_old_version.data.map(word => {
                return {
                    word: word.palavra,
                    definition: word.definicao,
                    register: word.registro,
                    ...(word.ultimaEdicao && { lastEdit: word.ultimaEdicao })
                }
            })

            const count = WordsController.MergeWords(words as unknown as StoreWord[])
            return { status: "success", count }
        }

        const is_new_version = words_schema.safeParse(json)

        if (is_new_version.success) {
            const count = WordsController.MergeWords(json as unknown as StoreWord[])
            return { status: "success", count }
        } else {
            console.log(is_new_version.error)
            throw new Error("Arquivo de importação inválido")
        }
    }

    static MergeWords(words: StoreWord[]) {
        const store_keys = data.store.words.map(p => p.word)
        const new_words = data.store.words

        let count = 0

        words.forEach(word => {
            if (!(word.word in store_keys)) {
                new_words.push(word)
                count++
            }
        })

        new_words.sort((a, b) => {
            return a.word.localeCompare(b.word)
        })

        data.set("words", new_words)

        return count
    }
}