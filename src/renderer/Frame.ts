import { ElectronFrame, frameStyle } from "electron-frame/renderer"
import { api } from "../store/Api"

const options = () => api.options()

const frame = new ElectronFrame({
    frameStyle: options().frameStyle as frameStyle,
    darkMode: (options().frameTheme === "auto" ? options().darkMode : options().frameTheme === "dark") as boolean,
})

const frameApi = {
    setFrameStyle(frameStyle: frameStyle) {
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

frame.insert()

export { frameApi as frame }