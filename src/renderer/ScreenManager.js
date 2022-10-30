import { Home } from "./pages/index.js"

export const ScreenManager = {
    atualScreen: Home(),
    setAtualScreen(screen) {
        this.atualScreen.remove()
        this.atualScreen = screen
        document.body.appendChild(screen)
    }
}