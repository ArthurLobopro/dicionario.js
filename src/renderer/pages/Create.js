import { CreateElement } from "../../Util.js"
import { Header } from "../components/Header.js"
import { Alert } from "../components/modals/Alert.js"
import { Page } from "../components/Page.js"

export function Create() {
    return Page({
        id: "create",
        content: [
            Header({
                title: "Adicionar Palavra"
            }),
            CreateElement("div", {
                className: "dashed-border spacing-16 grid-fill-center gap",
                content: [
                    `<label>
                        Palavra
                        <input type="text" id="word" placeholder="Palavra" minlength="3">
                    </label>
                    <div class="t-wrapper grid-fill-bottom">
                        Significado
                        <textarea id="sig" minlength="5" placeholder="Escreva os significados que a palavra pode ter."></textarea>
                    </div>`,
                    CreateElement("button", {
                        className: "btn",
                        content: "Adicionar",
                        onclick: () => {
                            const word_input = document.getElementById("word")
                            const sig_input = document.getElementById("sig")
                            const word = word_input.value.trim()
                            const sig = sig_input.value.trim()

                            if (word.length >= 3 && sig.length >= 5) {
                                try {
                                    window.api.createWord({
                                        palavra: word.trim(),
                                        definicao: sig.trim()
                                    })
                                    const alert = Alert({
                                        message: "Palavra adicionada com sucesso!",
                                        title: "Palavra Adicionada",
                                        onClose: () => {
                                            word_input.value = ""
                                            sig_input.value = ""
                                        }
                                    })
                                    document.body.appendChild(alert)
                                } catch (error) {
                                    const alert = Alert({
                                        message: error.message,
                                        title: "Erro!"
                                    })
                                    document.body.appendChild(alert)
                                }
                            } else {
                                const alert = Alert({
                                    message: "Escreva uma palavra e uma descrição válida.",
                                    title: "Erro!"
                                })
                                document.body.appendChild(alert)
                            }
                        }
                    })
                ]
            })
        ]
    })
}