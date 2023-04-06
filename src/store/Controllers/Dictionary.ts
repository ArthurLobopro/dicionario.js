import { dictionary } from "../Schemas"
import { data } from "../Store"
import { DictionariesController } from "./Dictionaries"

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

}

type words = {
    [s: string]: {
        definition: string
        register: Date
        lastEdit?: Date
    }
}


class WordsController {
    #dictionary: DictionaryController

    get dictionary() {
        return this.#dictionary.dictionary
    }

    constructor(dictionary: DictionaryController) {
        this.#dictionary = dictionary
    }

    get words() {
        return this.getWords()
    }

    get length() {
        return this.dictionary.words.length
    }

    getWords() {
        return Object.fromEntries(this.dictionary.words.map(word => {
            const { definition, register, lastEdit = null } = word
            return [
                word.word,
                {
                    definition,
                    register: new Date(register),
                    ...(lastEdit ? {
                        lastEdit: new Date(word.lastEdit as string)
                    } : {})
                }
            ]
        }))
    }

    getWord(word: string) {
        return this.words[word]
    }

    getWordsToSave(words: words) {
        return Object.entries(this.sortWords(words))
            .map(([word, { definition, register, lastEdit = null }]) => {
                return {
                    word,
                    definition,
                    register: register.toISOString(),
                    ...(lastEdit && { lastEdit: lastEdit.toISOString() })
                }
            })
    }

    sortWords(words: words) {
        return Object.fromEntries(
            Object.entries(words)
                .sort((a, b) => {
                    return a[0].localeCompare(b[0])
                })
        )
    }

    addWord({ word, definition }: { word: string, definition: string }) {
        const words = this.words

        if (word in words) {
            throw new Error("Word already exists")
        }

        words[word] = {
            definition,
            register: new Date()
        }

        this.dictionary.words = this.getWordsToSave(this.sortWords(words))
        this.#dictionary.save()
    }

    updateWord(word: string, { new_word, definition }: { new_word: string, definition: string }) {
        const words = this.words

        if (!(word in words)) {
            throw new Error("Word doesn't exist")
        }

        const wordData = words[word]

        if (word !== new_word) {
            delete words[word]
        }

        words[word] = {
            ...wordData,
            definition,
            lastEdit: new Date()
        }

        this.dictionary.words = this.getWordsToSave(this.sortWords(words))
        this.#dictionary.save()
    }

    deleteWord(word: string) {
        const words = this.words

        if (!(word in words)) {
            throw new Error("Word doesn't exist")
        }

        delete words[word]

        this.dictionary.words = this.getWordsToSave(words)

        this.#dictionary.save()
    }

    clearWords() {
        this.dictionary.words = []
    }
}