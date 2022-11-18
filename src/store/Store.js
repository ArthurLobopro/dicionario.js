const ElectronStore = require('electron-store')
const { palavrasSchema, optionsSchema } = require("./Schemas.js")

const data = new ElectronStore({
    name: "data",
    watch: true,
    schema: palavrasSchema
})

const options = new ElectronStore({
    name: "options",
    watch: true,
    schema: optionsSchema
})

data.get("palavras") ? null : data.store.palavras = []

module.exports = Object.freeze({
    data,
    options
})