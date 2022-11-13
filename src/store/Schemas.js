const ElectronStore = require('electron-store')

const data = new ElectronStore({
    name: "data",
    watch: true,
    schema: {
        palavras: {
            default: [],
            anyOf: [
                {
                    type: "array",
                    contains: {
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
                },
                {
                    type: "array",
                    default: []
                }
            ]
        }
    },
})

const options = new ElectronStore({
    name: "options",
    watch: true,
    schema: {
        darkMode: {
            type: "boolean",
            default: false
        },
        frameStyle: {
            type: "string",
            enum: ["windows", "macos"],
            default: "macos"
        }
    },
})

data.get("palavras") ? null : data.store.palavras = []

module.exports = { data, options }