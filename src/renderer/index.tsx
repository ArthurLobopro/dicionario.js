import { ipcRenderer } from "electron"
import React from "react"
import ReactDOM from "react-dom/client"
import { api } from "../store/Api"
import { AppRoutes } from "./Routes"
import { Release } from "./components/modals/Release"

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

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
)

root.render(
    <React.StrictMode>
        <AppRoutes />
    </React.StrictMode>
)

require("./Frame")