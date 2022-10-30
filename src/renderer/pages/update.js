import { CreateElement } from "../../Util.js"
import { Page } from "../components/page.js"

export function Update({ word }) {
    const palavra = window.api.palavras[word]
    return Page({
        id: "create",
        content: [
            `<header>
                <div class="return" title="Voltar">
                    <img src="../assets/left-arrow.svg" width="30">
                </div>
                <h1>Editar Palavra</h1>
            </header>`,
            CreateElement("div", {
                className: "dashed-border spacing-16 grid-fill-center gap",
                content: [
                    `<label>
                        Palavra
                        <input type="text" id="palavra" placeholder="Palavra" minlength="3" value="${word}">
                    </label>
                    <div class="t-wrapper grid-fill-bottom">
                        Significado
                        <textarea id="definicao" minlength="5" placeholder="Escreva os significados que a palavra pode ter.">${palavra.definicao}</textarea>
                    </div>`,
                    CreateElement("button", {
                        className: "btn",
                        content: "Atualizar",
                        onclick: () => {
                            const palavra = document.getElementById("palavra").value
                            const definicao = document.getElementById("definicao").value
                            window.api.updateWord(word, { palavra, definicao })
                        }
                    })
                ]
            })
        ]
    })
}