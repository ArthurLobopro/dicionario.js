import { Create } from "./pages/Create.js"
import { Home } from "./pages/index.js"
import { Update } from "./pages/Update.js"
import { ScreenManager } from "./ScreenManager.js"

if (api.options().darkMode) {
    document.body.classList.add("dark")
}

ScreenManager.setAtualScreen(Home())