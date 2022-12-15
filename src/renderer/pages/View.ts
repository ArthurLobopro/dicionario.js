import { api } from "../../store/Api"
import { assetsPath, CreateElement, loadSVG } from "../../Util"
import { Header } from "../components/Header"
import { Confirm } from "../components/modals/Confirm"
import { ViewModal } from "../components/modals/View"
import { Page } from "../components/Page"
import { ReturnButton } from "../components/ReturnButton"
import { ScreenManager } from "../ScreenManager"

export function View() {
    return Page({
        id: "view",
        content: [
            Header({
                title: "Visualizar Palavras",
                left: ReturnButton()
            }),
            CreateElement("div", {
                style: "position: relative;margin-bottom: 5px;",
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
                                                title: "Visualizar",
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
                                                title: "Editar",
                                                id: "edit",
                                                onclick: () => {
                                                    ScreenManager.setAtualScreen("update", { word: palavra })
                                                }
                                            }),
                                            CreateElement("div", {
                                                content: loadSVG(assetsPath, "trash-icon.svg"),
                                                id: "delete",
                                                title: "Excluir",
                                                onclick: () => {
                                                    const modal = Confirm({
                                                        message: "Deseja realmente excluir esta palavra?",
                                                        onClose: (confirm) => {
                                                            if (confirm) {
                                                                api.deleteWord(palavra)
                                                                ScreenManager.setAtualScreen("view")
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