import { ipcRenderer } from "electron"
import { WordsController } from "./Controllers/Words"
import { StoreOptions } from "./Schemas"
import { options } from "./Store"
import { OptionsController } from "./Controllers/Options"


export const api = {
    get version() {
        return ipcRenderer.sendSync("get-version")
    },

    get options() {
        return OptionsController
    },

    get words() {
        return WordsController
    }
}