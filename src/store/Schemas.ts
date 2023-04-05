import ElectronStore from "electron-store"

export type StoreWord = {
    word: string,
    definition: string,
    register: string,
    lastEdit?: string
}

export const wordsSchema: ElectronStore.Schema<{ words: StoreWord[] }> = {
    words: {
        type: "array",
        default: [],
        items: {
            type: "object",
            required: ["word", "definition", "register"],
            properties: {
                word: {
                    type: "string"
                },
                definition: {
                    type: "string"
                },
                register: {
                    type: "string",
                    format: "date-time"
                },
                lastEdit: {
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
    linux: {
        useSystemTitleBar: boolean
    }
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
    },
    linux: {
        type: "object",
        properties: {
            useSystemTitleBar: {
                type: "boolean"
            }
        },
        default: {
            useSystemTitleBar: false
        },
        required: ["useSystemTitleBar"]
    }
}

export type dictionary = {
    name: string,
    words: StoreWord[]
}

const dictionarySchema: ElectronStore.Schema<dictionary> = {
    name: {
        type: "string",
        default: "Default"
    },
    words: {
        type: "array",
        default: [],
        items: {
            type: "object",
            required: ["word", "definition", "register"],
            properties: {
                word: {
                    type: "string"
                },
                definition: {
                    type: "string"
                },
                register: {
                    type: "string",
                    format: "date-time"
                },
                lastEdit: {
                    type: "string",
                    format: "date-time"
                }
            }
        }
    }
}

export type StoreDictionaries = {
    dictionaries: dictionary[]
    defaultDictionary: string
}

export const dictionariesSchema: ElectronStore.Schema<StoreDictionaries> = {
    dictionaries: {
        type: "array",
        default: [{
            name: "Dicionário Padrão",
            isDefault: true,
            words: []
        }],
        items: {
            type: "object",
            properties: dictionarySchema
        }
    },
    defaultDictionary: {
        type: "string",
        default: "Dicionário Padrão"
    }
}