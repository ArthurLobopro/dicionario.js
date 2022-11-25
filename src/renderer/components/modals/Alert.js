import { CreateElement } from "../../../Util.js"
import { Wrapper } from "./Wrapper.js"

export class Alert {
    constructor({ title = "Atenção", message, onClose = () => { } }) {
        const wrapper = Wrapper({
            content: [
                CreateElement("div", {
                    className: "modal",
                    content: [
                        CreateElement("div", {
                            className: "modal-header",
                            content: title
                        }),
                        CreateElement("div", {
                            className: "modal-body",
                            content: message
                        }),
                        CreateElement("div", {
                            className: "modal-footer",
                            content: [
                                CreateElement("button", {
                                    content: "Ok",
                                    onclick: () => {
                                        wrapper.remove()
                                        onClose(true)
                                    }
                                })
                            ]
                        })
                    ]
                })
            ]
        })

        this.wrapper = wrapper
    }

    append(element) {
        element.appendChild(this.wrapper)
    }
}