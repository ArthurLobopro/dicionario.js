const ElectronStore = require('electron-store')

const data = new ElectronStore({
    name: "data",
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

data.get("palavras") ? null : data.store.palavras = []

module.exports = { data }