window.addEventListener("DOMContentLoaded", () => {
    require("../renderer/index.js")

    if (process.platform === "win32") {
        const { ipcRenderer } = require("electron")
        ipcRenderer.once("open-in", (event, path) => {
            window.location.hash = path
        })
    }
})