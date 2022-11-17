const { contextBridge, ipcRenderer } = require("electron")
const { ElectronFrame } = require('electron-frame/renderer')
const { api } = require("../store/Api.js")

contextBridge.exposeInMainWorld("require", require)
contextBridge.exposeInMainWorld("api", api)
contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer)

const options = () => api.options()

const frame = new ElectronFrame({
    frameStyle: options().frameStyle,
    darkMode: options().frameTheme === "auto" ? options().darkMode : options().frameTheme === "dark",
})

const frameApi = {
    setFrameStyle(frameStyle) {
        frame.setFrameStyle(frameStyle)
    },
    updateTheme() {
        const frameIsDark = frame.darkmode

        const { darkMode, frameTheme } = options()

        if (frameTheme === "auto" && darkMode !== frameIsDark) {
            return frame.toggleDarkMode()
        }

        if (frameIsDark && frameTheme === "light") {
            frame.toggleDarkMode()
        }

        if (!frameIsDark && frameTheme === "dark") {
            frame.toggleDarkMode()
        }
    }
}

contextBridge.exposeInMainWorld("frame", frameApi)

window.addEventListener("DOMContentLoaded", () => {
    frame.insert()
})