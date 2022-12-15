import { CreateElement } from "../../../Util"
import { Wrapper } from "./Wrapper"

interface alertProps {
    title: string
    message: string
    onClose?: () => void
}

export class Alert {
    wrapper: HTMLElement
    constructor({ title = "Atenção", message, onClose = () => { } }: alertProps) {
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
                                        onClose()
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

    append(element: HTMLElement) {
        element.appendChild(this.wrapper)
    }
}