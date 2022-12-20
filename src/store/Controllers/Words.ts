import { data } from "../Store"

type words = {
    [s: string]: {
        definicao: string
        registro: Date
        ultimaEdicao?: Date
    }
}

export class WordsController {

    static SortWords(words: words) {
        return Object.fromEntries(Object.entries(words).sort((a, b) => {
            return a[0].localeCompare(b[0])
        }))
    }

    static GetWords() {
        return Object.fromEntries(data.get("palavras").map(palavra => {
            const { definicao, registro, ultimaEdicao = null } = palavra
            return [
                palavra.palavra,
                {
                    definicao,
                    registro: new Date(registro),
                    ...(ultimaEdicao ? {
                        ultimaEdicao: new Date(palavra.ultimaEdicao as string)
                    } : {})
                }
            ]
        }))
    }

    static GetWordsToSave(words: words) {
        return Object.entries(WordsController.SortWords(words))
            .map(([palavra, { definicao, registro, ultimaEdicao = null }]) => {
                return {
                    palavra,
                    definicao,
                    registro: registro.toISOString(),
                    ...((ultimaEdicao && { ultimaEdicao: ultimaEdicao.toISOString() }) || {})
                }
            })
    }

    static SaveWord({ palavra: word, definicao }: { palavra: string, definicao: string }) {
        word = word.trim().toLowerCase()

        const words = WordsController.GetWords()

        if (word in words) {
            throw new Error(`A palavra ${word} já existe!`)
        }

        words[word] = {
            definicao,
            registro: new Date()
        }

        data.set("palavras", WordsController.GetWordsToSave(words))
    }

    static UpdateWord(word: string, { palavra: newWord, definicao }: { palavra: string, definicao: string }) {
        newWord = newWord.trim().toLowerCase()

        const words = WordsController.GetWords()

        if (!(word in words)) {
            throw new Error("Palavra não encontrada")
        }

        if (word !== newWord) {
            if (newWord in words) {
                throw new Error("Palavra já existe")
            }

            const new_palavra = words[word]
            delete words[word]
            words[newWord] = {
                ...new_palavra,
                definicao,
                ultimaEdicao: new Date()
            }
        } else {
            words[word] = {
                ...words[word],
                definicao,
                ultimaEdicao: new Date()
            }
        }

        data.set("palavras", WordsController.GetWordsToSave(words))
    }

    static DeleteWord(word: string) {
        const words = WordsController.GetWords()

        if (!(word in words)) {
            throw new Error("Palavra não encontrada")
        }

        delete words[word]

        data.set("palavras", WordsController.GetWordsToSave(words))
    }
}