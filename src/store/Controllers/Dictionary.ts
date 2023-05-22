import { dictionary } from "../Schemas"
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

    save() {
        DictionariesController.saveDictionary(this.dictionary)
    }

    export() {
        return JSON.stringify(this.dictionary, null, 4)
    }

}