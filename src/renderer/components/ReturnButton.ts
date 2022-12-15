import { assetsPath, CreateElement, loadSVG } from "../../Util"
import { ScreenManager } from "../ScreenManager"

type propType = Parameters<typeof ScreenManager.setAtualScreen>[0]

export function ReturnButton(returnTo: propType = "home") {
    return CreateElement("div", {
        className: "left",
        title: "Voltar",
        onclick: () => {
            ScreenManager.setAtualScreen(returnTo)
        },
        content: loadSVG(assetsPath, "left-arrow.svg")
    })
}