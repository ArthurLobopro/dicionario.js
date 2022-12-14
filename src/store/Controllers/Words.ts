import ajv from "ajv"
import ajvFormats from "ajv-formats"
import { ipcRenderer } from "electron"
import fs from "node:fs"
import path from "node:path"
import { StoreWord, wordsSchema } from "../Schemas"
import { data } from "../Store"

type words = {
    [s: string]: {
        definicao: string
        registro: Date
        ultimaEdicao?: Date
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
        return Object.fromEntries(data.get("palavras").map(palavra => {
            const { definicao, registro, ultimaEdicao = null } = palavra
            return [
                palavra.palavra,
                {
                    definicao,
                    registro: new Date(registro),
                    ...(ultimaEdicao ? {
                        ultimaEdicao: new Date(palavra.ultimaEdicao as string)
                    } : {})
                }
            ]
        }))
    }

    static GetWordsToSave(words: words) {
        return Object.entries(WordsController.SortWords(words))
            .map(([palavra, { definicao, registro, ultimaEdicao = null }]) => {
                return {
                    palavra,
                    definicao,
                    registro: registro.toISOString(),
                    ...((ultimaEdicao && { ultimaEdicao: ultimaEdicao.toISOString() }) || {})
                }
            })
    }

    static SaveWord({ palavra: word, definicao }: { palavra: string, definicao: string }) {
        word = word.trim().toLowerCase()

        const words = WordsController.GetWords()

        if (word in words) {
            throw new Error(`A palavra ${word} j?? existe!`)
        }

        words[word] = {
            definicao,
            registro: new Date()
        }

        data.set("palavras", WordsController.GetWordsToSave(words))
    }

    static UpdateWord(word: string, { palavra: newWord, definicao }: { palavra: string, definicao: string }) {
        newWord = newWord.trim().toLowerCase()

        const words = WordsController.GetWords()

        if (!(word in words)) {
            throw new Error("Palavra n??o encontrada")
        }

        if (word !== newWord) {
            if (newWord in words) {
                throw new Error("Palavra j?? existe")
            }

            const new_palavra = words[word]
            delete words[word]
            words[newWord] = {
                ...new_palavra,
                definicao,
                ultimaEdicao: new Date()
            }
        } else {
            words[word] = {
                ...words[word],
                definicao,
                ultimaEdicao: new Date()
            }
        }

        data.set("palavras", WordsController.GetWordsToSave(words))
    }

    static DeleteWord(word: string) {
        const words = WordsController.GetWords()

        if (!(word in words)) {
            throw new Error("Palavra n??o encontrada")
        }

        delete words[word]

        data.set("palavras", WordsController.GetWordsToSave(words))
    }

    static DeleteDictionary() {
        data.set("palavras", [])
    }

    static ExportWords() {
        try {
            const folder = ipcRenderer.sendSync("get-folder")

            if (folder === "canceled") {
                return { status: "canceled" }
            }

            const filename = path.join(folder, `dicionario_${GetDateToSave()}.json`)

            const words = data.get("palavras")
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
        })).compile(wordsSchema.palavras)

        const valid = validator(json)

        if (valid) {
            WordsController.MergeWords(json as unknown as StoreWord[])
            return { status: "success" }
        } else {
            console.log(validator.errors)
            throw new Error("Arquivo de importa????o inv??lido")
        }
    }

    static MergeWords(words: StoreWord[]) {
        const store_keys = data.store.palavras.map(p => p.palavra)

        const new_words = data.store.palavras

        words.forEach(word => {
            if (!(word.palavra in store_keys)) {
                new_words.push(word)
            }
        })

        new_words.sort((a, b) => {
            return a.palavra.localeCompare(b.palavra)
        })

        data.set("palavras", new_words)
    }
}