import ajv from "ajv"
import ajvFormats from "ajv-formats"
import { ipcRenderer } from "electron"
import fs from "fs"
import { WordsController } from "./Controllers/Words"
import { options } from "./Store"
import { StoreOptions, StoreWord } from "./Schemas"

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
    get version() {
        return ipcRenderer.sendSync("get-version")
    },

    get options() {
        return options.store
    },

    get words() {
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
    },

    async exportWords() {
        return WordsController.ExportWords()
    },

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

    toggleDarkMode() {
        options.set('darkMode', !options.store.darkMode)
    },

    setFrameTheme(frameTheme: StoreOptions["frameTheme"]) {
        options.set('frameTheme', frameTheme)
    },

    setFrameStyle(frameStyle: StoreOptions["frameStyle"]) {
        options.set('frameStyle', frameStyle)
    }
}