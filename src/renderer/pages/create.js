import { CreateElement } from "../../Util.js"
import { Page } from "../components/page.js"

export function Create() {
    return Page({
        id: "create",
        content: [
            `<header>
                <div class="return" title="Voltar">
                    <img src="../assets/left-arrow.svg" width="30">
                </div>
                <h1>Adicionar Palavra</h1>
            </header>`,
            CreateElement("div", {
                className: "dashed-border spacing-16 grid-fill-center gap",
                content: [
                    // CreateElement("label", {
                    //     content: [
                    //         "Palavra",
                    //         CreateElement("input", {
                    //             type: "text",
                    //             id: "word",
                    //             placeholder: "Palavra"
                    //         })
                    //     ]
                    // }),
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
                            console.table({ word, sig })
                        }
                    })
                ]
            })
        ]
    })
}