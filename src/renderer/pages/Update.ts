import { CreateElement } from "../../Util"
import { api } from "../../store/Api"
import { ScreenManager } from "../ScreenManager"
import { Header } from "../components/Header"
import { Page } from "../components/Page"
import { ReturnButton } from "../components/ReturnButton"
import { Alert } from "../components/modals/Alert"

export function Update({ word }: { word: string }) {
    const palavra = api.palavras[word]
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
                            const palavra_input = document.getElementById("word") as HTMLInputElement
                            const definicao_input = document.getElementById("definicao") as HTMLInputElement
                            const palavra = palavra_input.value
                            const definicao = definicao_input.value
                            try {
                                api.updateWord(word, { palavra, definicao })
                                new Alert({
                                    message: "Palavra atualizada com sucesso!",
                                    title: "Sucesso",
                                    onClose: () => {
                                        ScreenManager.setAtualScreen("view")
                                    }
                                }).append(document.body)
                            } catch (error: any) {
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