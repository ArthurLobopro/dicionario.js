import { ipcRenderer } from "electron"
import { api } from "../store/Api"
import { Release } from "./components/modals/Release"
import { ScreenManager } from "./ScreenManager"

if (api.options.darkMode) {
    document.body.classList.add("dark")
}

ipcRenderer.on("update-downloaded", () => {
    new Release({
        onClose: (result) => {
            if (result) {
                ipcRenderer.send("install-update")
            }
        }
    }).append(document.body)
})

ScreenManager.setAtualScreen("home")

require("./Frame")