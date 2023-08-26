import { StoreWord } from "../ZodSchemas/word"
import { DictionaryController } from "./Dictionary"

export class WordsController {
    #dictionary: DictionaryController

    get dictionary() {
        return this.#dictionary.data
    }

    constructor(dictionary: DictionaryController) {
        this.#dictionary = dictionary
    }

    get words() {
        return this.dictionary.words
    }

    get length() {
        return this.dictionary.words.length
    }

    getWord(word: string) {
        const finded_word = this.dictionary.words.find((w) => w.word === word)

        if (!word) {
            throw new Error("Palavra não encontrada")
        }

        return finded_word as StoreWord
    }

    private sortWords() {
        this.dictionary.words.sort((a, b) => {
            return a.word.localeCompare(b.word)
        })
    }

    private alreadyExists(word: string) {
        return this.dictionary.words.some((w) => w.word === word)
    }

    get newerWord() {
        const { words } = this.dictionary

        if (!words.length) return null

        const newerWord = words.reduce((newer, current) => {
            if (Date.parse(current.register) > Date.parse(newer.register)) {
                return current
            }

            return newer
        }, words[0])

        return newerWord
    }

    get olderWord() {
        const { words } = this.dictionary

        if (!words.length) return null

        const olderWord = words.reduce((older, current) => {
            if (Date.parse(current.register) < Date.parse(older.register)) {
                return current
            }

            return older
        }, words[0])

        return olderWord
    }

    get biggerDefinitionWord() {
        const { words } = this.dictionary

        if (!words.length) return null

        const biggerDefinition = words.reduce((bigger, current) => {
            if (current.definition.length > bigger.definition.length) {
                return current
            }

            return bigger
        }, words[0])

        return biggerDefinition
    }

    get biggerLinesDefinitionWord() {
        const { words } = this.dictionary

        if (!words.length) return null

        const biggerDefinition = words.reduce((bigger, current) => {
            if (
                current.definition.split("\n").length >
                bigger.definition.split("\n").length
            ) {
                return current
            }

            return bigger
        }, words[0])

        return biggerDefinition
    }

    addWord({ word, definition }: { word: string; definition: string }) {
        if (this.alreadyExists(word)) {
            throw new Error("A palavra já foi registrada")
        }

        this.dictionary.words.push({
            word,
            definition,
            register: new Date().toISOString(),
        })

        this.sortWords()
        this.#dictionary.save()
    }

    updateWord(
        word: string,
        { new_word, definition }: { new_word: string; definition: string },
    ) {
        if (!this.alreadyExists(word)) {
            throw new Error("A palavra não foi registrada")
        }

        if (word !== new_word) {
            if (this.alreadyExists(new_word)) {
                throw new Error(
                    "Você não pode renomear a palavra para uma palavra já registrada",
                )
            }
        }

        this.dictionary.words = this.dictionary.words.map((w) => {
            if (w.word === word) {
                return {
                    ...w,
                    word: new_word,
                    definition,
                    lastEdit: new Date().toISOString(),
                }
            }

            return w
        })

        word !== new_word && this.sortWords()
        this.#dictionary.save()
    }

    deleteWord(word: string) {
        if (!this.alreadyExists(word)) {
            throw new Error("Palavra não encontrada")
        }

        this.dictionary.words = this.dictionary.words.filter(
            (w) => w.word !== word,
        )

        this.#dictionary.save()
    }

    mergeWords(words: StoreWord[]) {
        const new_words = this.words
        const keys = new_words.map((w) => w.word)

        words.forEach((word) => {
            if (!keys.includes(word.word)) {
                new_words.push(word)
            }
        })

        this.dictionary.words = new_words

        this.sortWords()
        this.#dictionary.save()
    }
}
