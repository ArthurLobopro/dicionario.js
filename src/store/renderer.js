const { data } = require("./Schemas.js")

let palavras = Object.fromEntries(data.get("palavras").map(palavra => {
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

const api = {
    get palavras() {
        return palavras
    },

    updateWord(word, { palavra, definicao }) {
        if (!word in palavras) {
            throw new Error("Palavra não encontrada")
        }

        palavras[word] = {
            ...palavras[word],
            palavra,
            definicao,
            ultimaEdicao: new Date()
        }

        SortWords()

        data.set("palavras", GetWordsToSave())
    }
}

module.exports = { api }