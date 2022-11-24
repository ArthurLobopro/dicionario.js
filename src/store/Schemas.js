const palavrasSchema = {
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
                    anyOf: [
                        {
                            type: "string",
                            format: "date-time"
                        },
                        {
                            type: "null"
                        }
                    ]
                }
            }
        }
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