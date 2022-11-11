import { CreateElement } from "../../Util.js"
import { Home } from "../pages/index.js"
import { ScreenManager } from "../ScreenManager.js"

export function Header(props) {
    return CreateElement("header", {
        className: "grid-fill-center gap",
        content: [
            CreateElement("div", {
                className: "return",
                title: "Voltar",
                content: CreateElement("img", {
                    src: "../assets/left-arrow.svg",
                    id: "return",
                    onclick: () => {
                        ScreenManager.setAtualScreen(Home())
                    }
                })
            }),
            CreateElement("h1", {
                content: props.title
            })
        ]
    })
}