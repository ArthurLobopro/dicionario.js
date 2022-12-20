import ElectronStore from 'electron-store'

export type StoreWord = {
    palavra: string,
    definicao: string,
    registro: string,
    ultimaEdicao?: string
}

export const data = new ElectronStore<{ palavras: StoreWord[] }>({
    name: "data",
    watch: true,
    schema: {
        palavras: {
            type: "array",
            default: [],
            items: {
                type: "object",
                required: ["palavra", "definicao", "registro"],
                properties: {
                    palavra: {
                        type: "string"
                    },
                    definicao: {
                        type: "string"
                    },
                    registro: {
                        type: "string",
                        format: "date-time"
                    },
                    ultimaEdicao: {
                        type: "string",
                        format: "date-time"
                    }
                }
            }
        }
    }
})

export const options = new ElectronStore({
    name: "options",
    watch: true,
    schema: {
        darkMode: {
            type: "boolean",
            default: true
        },
        frameStyle: {
            type: "string",
            enum: ["windows", "macos"],
            default: "windows"
        },
        frameTheme: {
            type: "string",
            enum: ["light", "dark", "auto"],
            default: "auto"
        }
    }
})

data.get("palavras") ? null : data.store.palavras = []
