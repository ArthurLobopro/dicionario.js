import { CreateElement } from "../../../Util.js"
import { Wrapper } from "./Wrapper.js"

export function Confirm({ title = "Atenção", message, onClose = () => { } }) {
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

    return wrapper
}