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
            throw new Error(`A palavra ${word} já existe!`)
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
            throw new Error("Palavra não encontrada")
        }

        if (word !== newWord) {
            if (newWord in words) {
                throw new Error("Palavra já existe")
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
            throw new Error("Palavra não encontrada")
        }

        delete words[word]

        data.set("palavras", WordsController.GetWordsToSave(words))
    }

    static ExportWords() {
        try {
            const folder = ipcRenderer.sendSync("get-folder")

            if (folder === "canceled") {
                return "canceled"
            }

            const filename = path.join(folder, "dicionario.json")

            const words = data.get("palavras")
            const json = JSON.stringify(words, null, 4)

            fs.writeFileSync(filename, json)

            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }

    static ImportWords() {
        const file = ipcRenderer.sendSync("get-file")

        if (file === "canceled") {
            return "canceled"
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
        } else {
            console.log(validator.errors)
            throw new Error("Arquivo de importação inválido")
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