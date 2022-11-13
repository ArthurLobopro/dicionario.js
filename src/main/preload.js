const { contextBridge, ipcRenderer } = require("electron")
const { electronFrame } = require('electron-frame/renderer')
const { api } = require("../store/Api.js")

contextBridge.exposeInMainWorld("require", require)
contextBridge.exposeInMainWorld("api", api)
contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer)

const frame = new electronFrame({
    frameStyle: api.options().frameStyle,
})

const frameApi = {
    setFrameStyle(frameStyle) {
        frame.setFrameStyle(frameStyle)
    },
}

contextBridge.exposeInMainWorld("frame", frameApi)

window.addEventListener("DOMContentLoaded", () => {
    frame.insert()
})