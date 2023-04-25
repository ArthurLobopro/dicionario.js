import { StoreWord, dictionary } from "../Schemas"
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

    export() {
        return JSON.stringify(this.dictionary, null, 4)
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
        return this.words[word] || null
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
            throw new Error("A palavra já foi registrada")
        }

        words[word] = {
            definition,
            register: new Date()
        }

        this.dictionary.words = this.getWordsToSave(this.sortWords(words))
        this.#dictionary.save()
    }

    getNewerWord() {
        const words = this.words

        const newerWord = Object.entries(words)
            .sort((a, b) => {
                return b[1].register.getTime() - a[1].register.getTime()
            })[0]

        return newerWord?.[0]
    }

    getOlderWord() {
        const words = this.words

        const olderWord = Object.entries(words)
            .sort((a, b) => {
                return a[1].register.getTime() - b[1].register.getTime()
            })[0]

        return olderWord?.[0]
    }

    updateWord(word: string, { new_word, definition }: { new_word: string, definition: string }) {
        const words = this.words

        if (!(word in words)) {
            throw new Error("A palavra não foi registrada")
        }

        const wordData = words[word]

        if (word !== new_word) {
            delete words[word]
        }

        words[new_word] = {
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
            throw new Error("Palavra não encontrada")
        }

        delete words[word]

        this.dictionary.words = this.getWordsToSave(words)

        this.#dictionary.save()
    }

    clearWords() {
        this.dictionary.words = []
    }

    mergeWords(words: StoreWord[]) {

        const new_words = this.words
        const keys = Object.entries(new_words).map(([key]) => key)

        words.forEach(word => {
            if (!keys.includes(word.word)) {
                new_words[word.word] = {
                    definition: word.definition,
                    register: new Date(word.register),
                    ...(word.lastEdit ? {
                        lastEdit: new Date(word.lastEdit)
                    } : {})
                }
            }
        })

        console.log(words)
        console.log(new_words)

        this.dictionary.words = this.getWordsToSave(this.sortWords(new_words))

        this.#dictionary.save()
    }
}