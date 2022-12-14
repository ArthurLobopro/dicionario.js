import { Config } from "./pages/Config.js"
import { Create } from "./pages/Create.js"
import { Home } from "./pages/Home.js"
import { Update } from "./pages/Update.js"
import { View } from "./pages/View.js"

const screen_types = {
    create: Create,
    home: Home,
    view: View,
    config: Config,
    update: Update
}

type screen = keyof typeof screen_types
type options = { [key: string]: any }

export const ScreenManager = {
    atualScreen: Home(),

    setAtualScreen<T extends screen>(screen: T, options?: options) {
        this.atualScreen.remove()
        //@ts-ignore
        this.atualScreen = screen_types[screen](options)
        document.body.appendChild(this.atualScreen)
    }
}