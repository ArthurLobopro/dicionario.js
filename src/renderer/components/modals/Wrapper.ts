import { CreateElement } from "../../../Util"

export function Wrapper({ content }: { content: HTMLElement | HTMLElement[] }) {
    return CreateElement("div", {
        className: "modal-wrapper",
        content: content
    })
}