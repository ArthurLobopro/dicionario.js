const { contextBridge, ipcRenderer } = require("electron")
const { ElectronFrame } = require('electron-frame/renderer')
const { api } = require("../store/Api.js")

ipcRenderer.on("update-downloaded", () => {
    console.log("preoload send update-downloaded")
    window.dispatchEvent(new CustomEvent("update-downloaded"))
})

window.addEventListener("DOMContentLoaded", () => {
    require("../renderer/index.js")
})