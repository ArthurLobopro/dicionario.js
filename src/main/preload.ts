import { ipcRenderer } from "electron"

ipcRenderer.on("update-downloaded", () => {
    console.log("preoload send update-downloaded")
    window.dispatchEvent(new CustomEvent("update-downloaded"))
})

window.addEventListener("DOMContentLoaded", () => {
    require("../renderer/index.js")
})