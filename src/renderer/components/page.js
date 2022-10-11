import { CreateElement } from "../../Util.js"

export function Page({ content, id = "" }) {
    return CreateElement("div", {
        className: "page",
        content,
        id
    })
}