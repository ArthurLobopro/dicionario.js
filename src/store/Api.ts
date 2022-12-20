import { data, options, type palavra } from "./Store"
import { ipcRenderer } from "electron"
import path from "path"
import fs from "fs"

import ajv from "ajv"
import ajvFormats from "ajv-formats"
import { mergeWords } from "./PalavrasController"
import { WordsController } from "./Controllers/Words"

let palavras: {
    [s: string]: {
        definicao: string
        registro: Date
        ultimaEdicao?: Date
    }
}

function GetWordsToSave() {
    return Object.entries(palavras).map(([palavra, { definicao, registro, ultimaEdicao = null }]) => {
        return {
            palavra,
            definicao,
            registro: registro.toISOString(),
            ...((ultimaEdicao && { ultimaEdicao: ultimaEdicao.toISOString() }) || {})
        }
    })
}

async function exportWords() {
    const words = GetWordsToSave()
    const json = JSON.stringify(words, null, 4)

    try {
        const folder = ipcRenderer.sendSync("get-folder")
        console.log(folder)

        if (folder === "canceled") {
            return "canceled"
        }

        const filename = path.join(folder, "dicionario.json")
        fs.writeFileSync(filename, json)

        return true
    } catch (error) {
        console.error(error)
        return false
    }
}

async function importWords(palavras: palavra[]) {
    const validator = ajvFormats(new ajv()).compile({
        type: "array",
        default: [],
        items: {
            type: "object",
            required: ["palavra", "definicao", "registro"],
            properties: {
                palavra: {
                    type: "string"
                },
                definicao: {
                    type: "string"
                },
                registro: {
                    type: "string",
                    format: "date-time"
                },
                ultimaEdicao: {
                    type: "string",
                    format: "date-time"
                }
            }
        }
    })

    if (validator(palavras)) {
        mergeWords(palavras)
        UpdateWords()
    } else {
        throw new Error("Arquivo inválido")
    }
}

export const api = {
    exportWords,
    importWords() {
        try {
            const file = ipcRenderer.sendSync("get-file")
            console.log(file)

            if (file === "canceled") {
                return "canceled"
            }

            const jsonString = fs.readFileSync(file).toString()
            console.log(jsonString)

            const json = JSON.parse(jsonString)
            console.log(json)

            importWords(json)
        } catch (error) {
            console.error(error)
            return false
        }
    },

    version() {
        return ipcRenderer.sendSync("get-version")
    },

    options() {
        return options.store
    },

    toggleDarkMode() {
        options.set('darkMode', !options.store.darkMode)
    },

    setFrameTheme(frameTheme: "light" | "dark" | "auto") {
        options.set('frameTheme', frameTheme)
    },

    setFrameStyle(frameStyle: "windows" | "macos") {
        options.set('frameStyle', frameStyle)
    },

    palavras() {
        return WordsController.GetWords()
    },

    updateWord(word: string, { palavra, definicao }: { palavra: string, definicao: string }) {
        WordsController.UpdateWord(word, { palavra, definicao })
    },

    createWord({ palavra, definicao }: { palavra: string, definicao: string }) {
        WordsController.SaveWord({ palavra, definicao })
    },

    deleteWord(word: string) {
        WordsController.DeleteWord(word)
    }
}