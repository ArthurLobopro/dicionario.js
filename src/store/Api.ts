import ajv from "ajv"
import ajvFormats from "ajv-formats"
import { ipcRenderer } from "electron"
import fs from "fs"
import path from "path"
import { WordsController } from "./Controllers/Words"
import { data, options, type StoreWord } from "./Store"

async function exportWords() {
    const words = data.get("palavras")

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

async function importWords(palavras: StoreWord[]) {
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
        WordsController.MergeWords(palavras)
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

    get version() {
        return ipcRenderer.sendSync("get-version")
    },

    get options() {
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

    get palavras() {
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