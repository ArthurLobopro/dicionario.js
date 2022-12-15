import { Config } from "./pages/Config"
import { Create } from "./pages/Create"
import { Home } from "./pages/Home"
import { Update } from "./pages/Update"
import { View } from "./pages/View"

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