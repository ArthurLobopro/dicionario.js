import { ipcRenderer } from "electron"
import { api } from "../store/Api.js"
import { Release } from "./components/modals/Release.js"
import { ScreenManager } from "./ScreenManager.js"

if (api.options().darkMode) {
    document.body.classList.add("dark")
}

window.addEventListener("update-downloaded", () => {
    console.log("render recive update-downloaded")
    new Release({
        onClose: (result) => {
            if (result) {
                ipcRenderer.send("install-update")
            }
        }
    }).append(document.body)
})

ScreenManager.setAtualScreen("home")

import "./Frame"