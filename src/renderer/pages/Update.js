import { CreateElement } from "../../Util.js"
import { Header } from "../components/Header.js"
import { Alert } from "../components/modals/Alert.js"
import { Page } from "../components/page.js"

export function Update({ word }) {
    const palavra = window.api.palavras()[word]
    return Page({
        id: "create",
        content: [
            Header({
                title: "Editar Palavra"
            }),
            CreateElement("div", {
                className: "dashed-border spacing-16 grid-fill-center gap",
                content: [
                    `<label>
                        Palavra
                        <input type="text" id="word" placeholder="Palavra" minlength="3" value="${word}">
                    </label>
                    <div class="t-wrapper grid-fill-bottom">
                        Significado
                        <textarea id="definicao" minlength="5" placeholder="Escreva os significados que a palavra pode ter.">${palavra.definicao}</textarea>
                    </div>`,
                    CreateElement("button", {
                        className: "btn",
                        content: "Atualizar",
                        onclick: () => {
                            const palavra_input = document.getElementById("word")
                            const definicao_input = document.getElementById("definicao")
                            const palavra = palavra_input.value
                            const definicao = definicao_input.value
                            try {
                                window.api.updateWord(word, { palavra, definicao })
                                const alert = Alert({
                                    message: "Palavra atualizada com sucesso!",
                                    title: "Sucesso",
                                    onClose: () => {
                                        palavra_input.value = ""
                                        definicao_input.value = ""
                                    }
                                })
                                document.body.appendChild(alert)
                            } catch (error) {
                                const alert = Alert({
                                    message: error.message,
                                    title: "Erro"
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