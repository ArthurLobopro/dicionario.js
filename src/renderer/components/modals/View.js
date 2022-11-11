import { CreateElement } from "../../../Util.js"
import { Wrapper } from "./Wrapper.js"

export function ViewModal({ word, onClose = () => { } }) {
    const palavra = window.api.palavras()[word]

    const wrapper = Wrapper({
        content: [
            CreateElement("div", {
                className: "modal",
                content: [
                    CreateElement("div", {
                        className: "dashed-border spacing-16 grid-fill-center gap",
                        content: [
                            `<label>
                                Palavra
                                <input type="text" readonly value="${word}">
                            </label>
                            <div class="t-wrapper grid-fill-bottom">
                                Significado
                                <textarea readonly >${palavra.definicao}</textarea>
                            </div>`,
                            CreateElement("button", {
                                className: "btn",
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

    return wrapper
}