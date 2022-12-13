import { Release } from "./components/modals/Release.js"
import { ScreenManager } from "./ScreenManager.js"

if (api.options().darkMode) {
    document.body.classList.add("dark")
}

window.addEventListener("update-downloaded", () => {
    console.log("render recive update-downloaded")
    const releaseModal = Release({
        onClose: (result) => {
            if (result) {
                ipcRenderer.send("install-update")
            }
        }
    })
    document.body.appendChild(releaseModal)
})

ScreenManager.setAtualScreen("home")

// function TestModal(params) {
//     const releaseModal = Release({
//         onClose: (result) => {
//             if (result) {
//                 ipcRenderer.send("install-update")
//             }
//         }
//     })
//     document.body.appendChild(releaseModal)
// }

// setTimeout(TestModal, 10000)