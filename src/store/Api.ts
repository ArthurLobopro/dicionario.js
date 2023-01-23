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

    updateWord(word: string, { newWord, definition }: { newWord: string, definition: string }) {
        WordsController.UpdateWord(word, { newWord, definition })
    },

    createWord({ word, definition }: { word: string, definition: string }) {
        WordsController.SaveWord({ word, definition })
    },

    deleteWord(word: string) {
        WordsController.DeleteWord(word)
    },

    deleteDictionary() {
        WordsController.DeleteDictionary()
    },

    exportWords(words: string[]) {
        return WordsController.ExportWords(words)
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