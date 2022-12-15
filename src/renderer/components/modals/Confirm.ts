import { CreateElement } from "../../../Util"
import { Wrapper } from "./Wrapper"

export class Confirm {
    wrapper: HTMLElement
    constructor({ title = "Atenção", message, onClose = () => { } }: { title?: string; message: string; onClose?: (confirm: boolean) => void }) {
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
                                    content: "Sim",
                                    onclick: () => {
                                        wrapper.remove()
                                        onClose(true)
                                    }
                                }),
                                CreateElement("button", {
                                    className: "cancel",
                                    content: "Não",
                                    onclick: () => {
                                        wrapper.remove()
                                        onClose(false)
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