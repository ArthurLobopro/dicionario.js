import { assetsPath, CreateElement, loadSVG } from "../../Util.js"
import { Home } from "../pages/index.js"
import { ScreenManager } from "../ScreenManager.js"

export function Header(props) {
    return CreateElement("header", {
        className: "grid-fill-center gap",
        content: [
            CreateElement("div", {
                className: "return",
                title: "Voltar",
                onclick: () => {
                    ScreenManager.setAtualScreen(Home())
                },
                content: loadSVG(assetsPath, "left-arrow.svg")
            }),
            CreateElement("h1", {
                content: props.title
            })
        ]
    })
}