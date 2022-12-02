import { assetsPath, CreateElement, loadSVG } from "../../Util.js"
import { ScreenManager } from "../ScreenManager.js"

export function ReturnButton(returnTo = "home") {
    return CreateElement("div", {
        className: "left",
        title: "Voltar",
        onclick: () => {
            ScreenManager.setAtualScreen(returnTo)
        },
        content: loadSVG(assetsPath, "left-arrow.svg")
    })
}