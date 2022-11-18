const palavrasSchema = {
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
}

const optionsSchema = {
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
}

module.exports = Object.freeze({
    palavrasSchema,
    optionsSchema
})