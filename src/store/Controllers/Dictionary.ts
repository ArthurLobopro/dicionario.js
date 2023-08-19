import { dictionary } from "../ZodSchemas/dictionary"
import { DictionariesController } from "./Dictionaries"
import { WordsController } from "./Words"

export class DictionaryController {
    data: dictionary

    constructor(dictionary: dictionary) {
        this.data = dictionary
    }

    get Words() {
        return new WordsController(this)
    }

    get name() {
        return this.data.name
    }

    get languages() {
        return this.data.languages
    }

    get isDefault() {
        return (
            this.data.name === DictionariesController.getDefaultDictionaryName()
        )
    }

    changeName(newName: string) {
        DictionariesController.editDictionary(this.data.name, { newName })
    }

    save() {
        DictionariesController.saveDictionary(this.data)
    }

    export() {
        return JSON.stringify(this.data, null, 4)
    }
}
