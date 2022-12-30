import { ipcRenderer } from "electron"
import { WordsController } from "./Controllers/Words"
import { StoreOptions } from "./Schemas"
import { options } from "./Store"


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
        return WordsController.ImportWords()
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