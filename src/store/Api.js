const { data, options } = require("./Schemas.js")

let palavras

function GetWordsToSave() {
    return Object.entries(palavras).map(([palavra, { definicao, registro, ultimaEdicao }]) => {
        return {
            palavra,
            definicao,
            registro,
            ultimaEdicao
        }
    })
}

function SortWords() {
    palavras = Object.fromEntries(Object.entries(palavras).sort((a, b) => {
        return a[0].localeCompare(b[0])
    }))
}

function UpdateWords() {
    palavras = Object.fromEntries(data.get("palavras").map(palavra => {
        const { definicao, registro, ultimaEdicao = null } = palavra
        return [
            palavra.palavra,
            {
                definicao,
                registro: new Date(registro),
                ultimaEdicao: ultimaEdicao && new Date(palavra.ultimaEdicao)
            }
        ]
    }))
}

const api = {
    options() {
        return options.store
    },

    toggleDarkMode() {
        options.set('darkMode', !options.store.darkMode)
    },

    palavras() {
        return palavras
    },

    updateWord(word, { palavra, definicao }) {
        palavra = palavra.trim().toLowerCase()

        if (!word in palavras) {
            throw new Error("Palavra não encontrada")
        }

        if (word !== palavra) {
            if (palavra in palavras) {
                throw new Error("Palavra já existe")
            }

            const new_palavra = palavras[word]
            delete palavras[word]
            palavras[palavra] = {
                ...new_palavra,
                palavra,
                definicao,
                ultimaEdicao: new Date()
            }
        } else {
            palavras[word] = {
                ...palavras[word],
                palavra,
                definicao,
                ultimaEdicao: new Date()
            }
        }

        SortWords()

        data.set("palavras", GetWordsToSave())

        UpdateWords()
    },

    createWord({ palavra, definicao }) {
        palavra = palavra.trim().toLowerCase()

        if (palavra in palavras) {
            throw new Error("Palavra já existe")
        }

        palavras[palavra] = {
            palavra,
            definicao,
            registro: new Date()
        }

        SortWords()

        data.set("palavras", GetWordsToSave())

        UpdateWords()
    },

    deleteWord(palavra) {
        if (!palavra in palavras) {
            throw new Error("Palavra não encontrada")
        }

        delete palavras[palavra]

        SortWords()

        data.set("palavras", GetWordsToSave())

        UpdateWords()
    }
}

UpdateWords()

module.exports = { api }