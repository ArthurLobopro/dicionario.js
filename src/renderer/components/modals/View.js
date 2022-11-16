import { CreateElement, formatDate } from "../../../Util.js"
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
                            `<div>
                                <div>Palavra</div>
                                <textarea readonly rows="1" class="info big">${word}</textarea>
                            </div>
                            <div class="t-wrapper grid-fill-bottom">
                                <div>Significado</div>
                                <textarea rows="3" readonly class="info big" >${palavra.definicao}</textarea>
                            </div>`,
                            `<div class="date-wrapper">
                                <div>
                                    <span>Data de registro</span> <span class="info">${formatDate(palavra.registro)}</span>
                                </div>
                                ${palavra.ultimaEdicao ?
                                `<div>
                                        <span>Última edição</span> <span class="info">${formatDate(palavra.ultimaEdicao)}</span>
                                    </div>`
                                : ""
                            }
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