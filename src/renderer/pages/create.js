import { CreateElement } from "../../Util.js"
import { Header } from "../components/Header.js"
import { Page } from "../components/page.js"

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
                            const word = document.getElementById("word").value
                            const sig = document.getElementById("sig").value
                            window.api.createWord({
                                palavra: word.trim(),
                                definicao: sig.trim()
                            })
                        }
                    })
                ]
            })
        ]
    })
}