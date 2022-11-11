// import { api } from "../../store/Api.js"
import { CreateElement } from "../../Util.js"
import { Header } from "../components/Header.js"
import { Confirm } from "../components/modals/Confirm.js"
import { ViewModal } from "../components/modals/View.js"
import { ScreenManager } from "../ScreenManager.js"
import { Update } from "./Update.js"

export function View() {
    return CreateElement("div", {
        id: "view",
        className: "page",
        content: [
            Header({
                title: "Visualizar Palavras"
            }),
            CreateElement("div", {
                style: "position: relative",
                content: [
                    CreateElement("div", {
                        className: "word-wrapper",
                        content: Object.entries(api.palavras()).map(([palavra, palavra_props]) => {
                            return CreateElement("div", {
                                className: "word",
                                content: [
                                    CreateElement("div", {
                                        content: [
                                            CreateElement("div", {
                                                className: "word-header",
                                                content: palavra
                                            }),
                                            CreateElement("div", {
                                                className: "word-definition",
                                                content: palavra_props.definicao
                                            })
                                        ]
                                    }),
                                    CreateElement("div", {
                                        className: "controls",
                                        content: [
                                            CreateElement("img", {
                                                src: "../assets/eye-icon.svg",
                                                width: "30",
                                                onclick: () => {
                                                    const viewModal = ViewModal({
                                                        word: palavra,
                                                        onClose: () => {

                                                        }
                                                    })
                                                    document.body.appendChild(viewModal)
                                                }
                                            }),
                                            CreateElement("img", {
                                                src: "../assets/edit-icon.svg",
                                                width: "30",
                                                onclick: () => {
                                                    ScreenManager.setAtualScreen(Update({ word: palavra }))
                                                }
                                            }),
                                            CreateElement("img", {
                                                src: "../assets/trash-icon.svg",
                                                width: "30",
                                                onclick: () => {
                                                    const modal = Confirm({
                                                        message: "Deseja realmente excluir esta palavra?",
                                                        onClose: (confirm) => {
                                                            if (confirm) {
                                                                api.deleteWord(palavra)
                                                                ScreenManager.setAtualScreen(View())
                                                            }
                                                        }
                                                    })
                                                    document.body.appendChild(modal)
                                                }
                                            })
                                        ],
                                    })
                                ]
                            })
                        })
                    })
                ]
            })
        ]
    })
}