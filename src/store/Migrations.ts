import Store from "electron-store"

type versions_types = {
    "1.8.1": {
        palavras: {
            palavra: string,
            definicao: string,
            registro: string,
            ultimaEdicao?: string
        }[]
    }
}


export const WordsMigrations = {
    "1.9.0": (store: Store<versions_types["1.8.1"]>) => {
        if (store.has("palavras") && store.get("palavras").length > 0) {
            const old_data = store.get("palavras")
            const new_data = old_data.map(word => {
                return {
                    word: word.palavra,
                    definition: word.definicao,
                    register: word.registro,
                    ...(word.ultimaEdicao && { lastEdit: word.ultimaEdicao })
                }
            })
            store.delete("palavras")
            store.set("words", new_data)
        }
    }
}