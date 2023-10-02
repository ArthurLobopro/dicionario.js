import { ipcRenderer } from "electron"
import { DataExporter } from "./Controllers/DataExporter"
import { DataImporter } from "./Controllers/DataImporter"
import { DictionariesController } from "./Controllers/Dictionaries"
import { OptionsController } from "./Controllers/Options"
import { WordsController } from "./Controllers/Words"

export const api = {
    get version() {
        return ipcRenderer.sendSync("get-version")
    },

    get options() {
        return OptionsController
    },

    get words() {
        return WordsController
    },

    get dictionaries() {
        return DictionariesController
    },

    get exporter() {
        return DataExporter
    },

    get importer() {
        return DataImporter
    },
}
