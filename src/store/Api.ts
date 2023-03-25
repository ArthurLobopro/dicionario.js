import { ipcRenderer } from "electron"
import { WordsController } from "./Controllers/Words"
import { StoreOptions } from "./Schemas"
import { options } from "./Store"
import { OptionsController } from "./Controllers/Options"


export const api = {
    get version() {
        return ipcRenderer.sendSync("get-version")
    },

    options: OptionsController,

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
        OptionsController.toggleDarkMode()
    },

    setFrameTheme(frameTheme: StoreOptions["frameTheme"]) {
        OptionsController.setFrameTheme(frameTheme)
    },

    setFrameStyle(frameStyle: StoreOptions["frameStyle"]) {
        OptionsController.setFrameStyle(frameStyle)
    }
}