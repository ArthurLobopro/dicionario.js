import { palavra, data } from "./Store"

export function mergeWords(palavras: palavra[]) {
    const store_keys = data.store.palavras.map(p => p.palavra)

    const new_words = data.store.palavras

    palavras.forEach(palavra => {
        if (!(palavra.palavra in store_keys)) {
            new_words.push(palavra)
        }
    })

    new_words.sort((a, b) => {
        return a.palavra.localeCompare(b.palavra)
    })

    data.set("palavras", new_words)
}