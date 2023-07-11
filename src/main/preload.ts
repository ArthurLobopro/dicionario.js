import { ipcRenderer } from "electron"

window.addEventListener("DOMContentLoaded", () => {
    require("../renderer/index.js")

    if (process.platform === "win32") {
        ipcRenderer.once("open-in", (event, path) => {
            window.location.hash = path
        })
    }
})
