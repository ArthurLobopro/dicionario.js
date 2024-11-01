import { ElectronFrame, FrameStyle } from "electron-frame/renderer"
import { api } from "../store/Api"

const options = () => api.options

const frame = new ElectronFrame({
  frameStyle: options().frameStyle as FrameStyle,
  darkMode: (options().frameTheme === "auto"
    ? options().darkMode
    : options().frameTheme === "dark") as boolean,
})

const frameApi = {
  setFrameStyle(frameStyle: FrameStyle) {
    frame.setFrameStyle(frameStyle)
  },

  updateTheme() {
    const frameIsDark = frame.darkmode

    const { darkMode, frameTheme } = options()

    const should_toggle_darkmode =
      (frameIsDark && frameTheme === "light") ||
      (!frameIsDark && frameTheme === "dark") ||
      (frameTheme === "auto" && darkMode !== frameIsDark)

    if (should_toggle_darkmode) {
      frame.toggleDarkMode()
    }
  },

  get instance() {
    return frame
  },
}

const isLinux = process.platform === "linux"

if (!isLinux || !api.options.getOptions().linux.useSystemTitleBar) {
  frame.insert()
}

export { frameApi as frame }
