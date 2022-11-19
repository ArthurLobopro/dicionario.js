import { assetsPath, CreateElement, loadSVG } from "../../Util.js"
import { ScreenManager } from "../ScreenManager.js"

export function Header(props) {
    return CreateElement("header", {
        className: "grid-fill-center gap",
        content: [
            CreateElement("div", {
                className: "return",
                title: "Voltar",
                onclick: () => {
                    ScreenManager.setAtualScreen("home")
                },
                content: loadSVG(assetsPath, "left-arrow.svg")
            }),
            CreateElement("h1", {
                content: props.title
            })
        ]
    })
}