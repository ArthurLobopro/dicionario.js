import { ipcRenderer } from "electron"

window.addEventListener("DOMContentLoaded", () => {
    require("../renderer/index.js")

    ipcRenderer.once("open-in", (event, path) => {
        sessionStorage.setItem("openIn", path)
    })
})
