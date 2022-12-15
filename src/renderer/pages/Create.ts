import { api } from "../../store/Api"
import { CreateElement } from "../../Util"
import { Header } from "../components/Header"
import { Alert } from "../components/modals/Alert"
import { Page } from "../components/Page"
import { ReturnButton } from "../components/ReturnButton"

export function Create() {
    return Page({
        id: "create",
        content: [
            Header({
                title: "Adicionar Palavra",
                left: ReturnButton()
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
                            const word_input = document.getElementById("word") as HTMLInputElement
                            const sig_input = document.getElementById("sig") as HTMLTextAreaElement
                            const word = word_input.value.trim()
                            const sig = sig_input.value.trim()

                            if (word.length >= 3 && sig.length >= 5) {
                                try {
                                    api.createWord({
                                        palavra: word.trim(),
                                        definicao: sig.trim()
                                    })
                                    new Alert({
                                        message: "Palavra adicionada com sucesso!",
                                        title: "Palavra Adicionada",
                                        onClose: () => {
                                            word_input.value = ""
                                            sig_input.value = ""
                                        }
                                    }).append(document.body)
                                } catch (error: unknown) {
                                    new Alert({
                                        message: (error as Error).message,
                                        title: "Erro!"
                                    }).append(document.body)
                                }
                            } else {
                                new Alert({
                                    message: "Escreva uma palavra e uma descrição válida.",
                                    title: "Erro!"
                                }).append(document.body)
                            }
                        }
                    })
                ]
            })
        ]
    })
}