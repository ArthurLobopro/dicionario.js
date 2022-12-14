import { CreateElement } from "../../../Util.js"
import { Wrapper } from "./Wrapper.js"

export class Release {
    constructor({ onClose = () => { } }) {
        const wrapper = Wrapper({
            content: [
                CreateElement("div", {
                    className: "modal",
                    content: [
                        CreateElement("div", {
                            className: "modal-header",
                            content: "Atualização disponível"
                        }),
                        CreateElement("div", {
                            className: "modal-body",
                            content: "Uma nova atualização está disponível, reinicie o aplicativo para atualizar."
                        }),
                        CreateElement("div", {
                            className: "modal-footer",
                            content: [
                                CreateElement("button", {
                                    content: "Reiniciar Agora",
                                    onclick: () => {
                                        wrapper.remove()
                                        onClose(true)
                                    }
                                }),
                                CreateElement("button", {
                                    className: "stroke",
                                    content: "Atualizar Depois",
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

    append(element) {
        element.appendChild(this.wrapper)
    }
}