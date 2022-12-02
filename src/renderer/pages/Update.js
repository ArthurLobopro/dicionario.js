import { CreateElement } from "../../Util.js"
import { Header } from "../components/Header.js"
import { Alert } from "../components/modals/Alert.js"
import { Page } from "../components/Page.js"
import { ReturnButton } from "../components/ReturnButton.js"

export function Update({ word }) {
    const palavra = window.api.palavras()[word]
    return Page({
        id: "edit",
        content: [
            Header({
                title: "Editar Palavra",
                left: ReturnButton("view")
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
                                new Alert({
                                    message: "Palavra atualizada com sucesso!",
                                    title: "Sucesso",
                                    onClose: () => {
                                        palavra_input.value = ""
                                        definicao_input.value = ""
                                    }
                                }).append(document.body)
                            } catch (error) {
                                new Alert({
                                    message: error.message,
                                    title: "Erro"
                                }).append(document.body)
                            }
                        }
                    })
                ]
            })
        ]
    })
}