const { contextBridge, ipcRenderer } = require("electron")
const { electronFrame } = require('electron-frame/renderer')
const { api } = require("../store/Api.js")

contextBridge.exposeInMainWorld("require", require)
contextBridge.exposeInMainWorld("api", api)
contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer)

window.addEventListener("DOMContentLoaded", () => {
    const frame = new electronFrame({
        frameStyle: "macos"
    })
    frame.insert()
})