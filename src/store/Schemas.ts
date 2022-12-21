import ElectronStore from "electron-store"

export type StoreWord = {
    palavra: string,
    definicao: string,
    registro: string,
    ultimaEdicao?: string
}

export const wordsSchema: ElectronStore.Schema<{ palavras: StoreWord[] }> = {
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

export type StoreOptions = {
    darkMode: boolean
    frameStyle: "windows" | "macos"
    frameTheme: "light" | "dark" | "auto"
}

export const optionsSchema: ElectronStore.Schema<StoreOptions> = {
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