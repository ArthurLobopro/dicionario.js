import { dictionary } from "../ZodSchemas/dictionary"
import { DictionariesController } from "./Dictionaries"
import { WordsController } from "./Words"

export class DictionaryController {
    dictionary: dictionary

    constructor(dictionary: dictionary) {
        this.dictionary = dictionary
    }

    get Words() {
        return new WordsController(this)
    }

    get name() {
        return this.dictionary.name
    }

    get languages() {
        return this.dictionary.languages
    }

    get isDefault() {
        return (
            this.dictionary.name ===
            DictionariesController.getDefaultDictionaryName()
        )
    }

    changeName(newName: string) {
        DictionariesController.editDictionary(this.dictionary.name, { newName })
    }

    save() {
        DictionariesController.saveDictionary(this.dictionary)
    }

    export() {
        return JSON.stringify(this.dictionary, null, 4)
    }
}
