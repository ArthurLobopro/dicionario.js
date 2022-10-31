import { CreateElement } from "../../../Util.js"

export function Confirm({ title = "Atenção", message, onClose = () => { } }) {
    const wrapper = CreateElement("div", {
        className: "modal-wrapper",
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