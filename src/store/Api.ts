import { data, options } from "./Store"
import { ipcRenderer } from "electron"
import path from "path"
import fs from "fs"

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

function SortWords() {
    palavras = Object.fromEntries(Object.entries(palavras).sort((a, b) => {
        return a[0].localeCompare(b[0])
    }))
}

function UpdateWords() {
    //@ts-ignore
    palavras = Object.fromEntries(data.get("palavras").map(palavra => {
        const { definicao, registro, ultimaEdicao = null } = palavra
        return [
            palavra.palavra,
            {
                definicao,
                registro: new Date(registro),
                ultimaEdicao: ultimaEdicao && new Date(palavra.ultimaEdicao)
            }
        ]
    }))

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

export const api = {
    exportWords,

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
        return palavras
    },

    updateWord(word: string, { palavra, definicao }: { palavra: string, definicao: string }) {
        palavra = palavra.trim().toLowerCase()

        if (!(word in palavras)) {
            throw new Error("Palavra não encontrada")
        }

        if (word !== palavra) {
            if (palavra in palavras) {
                throw new Error("Palavra já existe")
            }

            const new_palavra = palavras[word]
            delete palavras[word]
            palavras[palavra] = {
                ...new_palavra,
                definicao,
                ultimaEdicao: new Date()
            }
        } else {
            palavras[word] = {
                ...palavras[word],
                definicao,
                ultimaEdicao: new Date()
            }
        }

        SortWords()

        data.set("palavras", GetWordsToSave())

        UpdateWords()
    },

    createWord({ palavra, definicao }: { palavra: string, definicao: string }) {
        palavra = palavra.trim().toLowerCase()

        if (palavra in palavras) {
            throw new Error("Palavra já existe")
        }

        palavras[palavra] = {
            definicao,
            registro: new Date()
        }

        SortWords()

        data.set("palavras", GetWordsToSave())

        UpdateWords()
    },

    deleteWord(palavra: string) {
        if (!(palavra in palavras)) {
            throw new Error("Palavra não encontrada")
        }

        delete palavras[palavra]

        SortWords()

        data.set("palavras", GetWordsToSave())

        UpdateWords()
    }
}

UpdateWords()