import { ipcRenderer } from "electron"
import React, { useEffect } from "react"
import ReactDOM from "react-dom/client"
import { api } from "../store/Api"
import { AppRoutes } from "./Routes"
import { ReleaseModal } from "./components/modals/Release"
import { useModal } from "./hooks/useModal"

if (api.options.darkMode) {
    document.body.classList.add("dark")
}

function App() {
    const modal = useModal()

    useEffect(() => {
        ipcRenderer.on("update-downloaded", () => {
            modal.open(<ReleaseModal onClose={(value) => {
                if (value) {
                    ipcRenderer.send("install-update")
                }
                modal.close()
            }} />)
        })
    }, [])

    const Wrapper =
        ipcRenderer.sendSync("isDev") ? React.StrictMode : React.Fragment
    // React.Fragment

    return (
        <Wrapper>
            {modal.content}
            <AppRoutes />
        </Wrapper>
    )
}

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
)

root.render(
    <App />
)

require("./Frame")
require("./Fonts")