import { CreateElement } from "../../Util"

export function Header({ title, left = undefined }: { title: string, left?: HTMLElement }) {
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