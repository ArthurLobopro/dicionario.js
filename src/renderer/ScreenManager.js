import { Config } from "./pages/Config.js"
import { Create } from "./pages/Create.js"
import { Home } from "./pages/index.js"
import { Update } from "./pages/Update.js"
import { View } from "./pages/View.js"

const screen_types = {
    create: Create,
    home: Home,
    view: View,
    config: Config,
    update: Update
}

export const ScreenManager = {
    atualScreen: Home(),
    /**
     * @param {keyof screen_types} screen
     */
    setAtualScreen(screen, options = {}) {
        this.atualScreen.remove()
        this.atualScreen = screen_types[screen](options)
        document.body.appendChild(this.atualScreen)
    }
}