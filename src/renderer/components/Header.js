import { CreateElement } from "../../Util.js"
import { ReturnButton } from "./ReturnButton.js"


export function Header({ title = "", left = null }) {
    return CreateElement("header", {
        className: "grid-fill-center gap",
        content: [
            left,
            CreateElement("h1", {
                content: title
            })
        ]
    })
}