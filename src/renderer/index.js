import { ScreenManager } from "./ScreenManager.js"

if (api.options().darkMode) {
    document.body.classList.add("dark")
}

ScreenManager.setAtualScreen("home")