// import { api } from "../../store/Api.js"
import { assetsPath, CreateElement, loadSVG } from "../../Util.js"
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
                                            CreateElement("div", {
                                                content: loadSVG(assetsPath, "eye-icon.svg"),
                                                onclick: () => {
                                                    const viewModal = ViewModal({
                                                        word: palavra,
                                                        onClose: () => {

                                                        }
                                                    })
                                                    document.body.appendChild(viewModal)
                                                }
                                            }),
                                            CreateElement("div", {
                                                content: loadSVG(assetsPath, "edit-icon.svg"),
                                                onclick: () => {
                                                    ScreenManager.setAtualScreen(Update({ word: palavra }))
                                                }
                                            }),
                                            CreateElement("div", {
                                                content: loadSVG(assetsPath, "trash-icon.svg"),
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