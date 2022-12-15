import { CreateElement } from "../../Util"

export function Page({ content, id = "" }: { content: HTMLElement | HTMLElement[]; id?: string }) {
    return CreateElement("div", {
        className: "page",
        content,
        id
    })
}
