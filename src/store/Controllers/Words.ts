import { StoreWord } from "../ZodSchemas/word"
import { DictionaryController } from "./Dictionary"

type words = {
    [s: string]: {
        definition: string
        register: Date
        lastEdit?: Date
    }
}
export class WordsController {
    #dictionary: DictionaryController

    get dictionary() {
        return this.#dictionary.data
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
        return Object.fromEntries(
            this.dictionary.words.map((word) => {
                const { definition, register, lastEdit = null } = word
                return [
                    word.word,
                    {
                        definition,
                        register: new Date(register),
                        ...(lastEdit
                            ? { lastEdit: new Date(word.lastEdit as string) }
                            : {}),
                    },
                ]
            }),
        )
    }

    getWord(word: string) {
        const finded_word = this.dictionary.words.find((w) => w.word === word)

        if (!word) {
            throw new Error("Palavra não encontrada")
        }

        return finded_word as StoreWord
    }

    getWordsToSave(words: words) {
        return Object.entries(this.sortWords(words)).map(
            ([word, { definition, register, lastEdit = null }]) => {
                return {
                    word,
                    definition,
                    register: register.toISOString(),
                    ...(lastEdit && { lastEdit: lastEdit.toISOString() }),
                }
            },
        )
    }

    sortWords(words: words) {
        return Object.fromEntries(
            Object.entries(words).sort((a, b) => {
                return a[0].localeCompare(b[0])
            }),
        )
    }

    addWord({ word, definition }: { word: string; definition: string }) {
        const words = this.words

        if (word in words) {
            throw new Error("A palavra já foi registrada")
        }

        words[word] = {
            definition,
            register: new Date(),
        }

        this.dictionary.words = this.getWordsToSave(this.sortWords(words))
        this.#dictionary.save()
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

    updateWord(
        word: string,
        { new_word, definition }: { new_word: string; definition: string },
    ) {
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
            lastEdit: new Date(),
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

    mergeWords(words: StoreWord[]) {
        const new_words = this.words
        const keys = Object.entries(new_words).map(([key]) => key)

        words.forEach((word) => {
            if (!keys.includes(word.word)) {
                new_words[word.word] = {
                    definition: word.definition,
                    register: new Date(word.register),
                    ...(word.lastEdit
                        ? { lastEdit: new Date(word.lastEdit) }
                        : {}),
                }
            }
        })

        this.dictionary.words = this.getWordsToSave(this.sortWords(new_words))

        this.#dictionary.save()
    }
}
