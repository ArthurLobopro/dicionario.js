const { contextBridge } = require("electron")
const { electronFrame } = require('electron-frame/renderer')
const { api } = require("../store/renderer.js")

contextBridge.exposeInMainWorld("require", require)
contextBridge.exposeInMainWorld("api", api)

window.addEventListener("DOMContentLoaded", () => {
    const frame = new electronFrame()
    frame.insert()
})