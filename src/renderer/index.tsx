import { ipcRenderer } from "electron"
import { api } from "../store/Api"
import { Release } from "./components/modals/Release"
// import { ScreenManager } from "./ScreenManager"

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

// ScreenManager.setAtualScreen("home")

import ReactDOM from "react-dom/client"
import React from "react"
import { Home } from "./pages/Home"

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
)

root.render(
    <React.StrictMode>
        <Home />
    </React.StrictMode>
)

require("./Frame")