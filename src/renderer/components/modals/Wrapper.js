import { CreateElement } from "../../../Util.js"

export function Wrapper(props) {
    return CreateElement("div", {
        className: "modal-wrapper",
        content: props.content
    })

}