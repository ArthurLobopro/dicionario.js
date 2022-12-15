import { assetsPath, CreateElement, loadSVG } from "../../Util"
import { Header } from "../components/Header"
import { Page } from "../components/Page"
import { ScreenManager } from "../ScreenManager"

function Option({ text, icon, onclick }: { text: string; icon: string; onclick: () => void }) {
    return CreateElement("div", {
        className: "option",
        content: [
            CreateElement("span", {
                content: text
            }),
            CreateElement("div", {
                style: "width: 30px; height: 30px;",
                content: icon
            })
        ],
        onclick
    })
}

export function Home() {
    return Page({
        id: "home",
        content: [
            Header({ title: "Dicionário Pessoal" }),
            CreateElement("div", {
                className: "option-wrapper",
                content: [
                    Option({
                        text: "Adicionar",
                        icon: loadSVG(assetsPath, "add-icon.svg"),
                        onclick: () => {
                            ScreenManager.setAtualScreen("create")
                        }
                    }),
                    Option({
                        text: "Visualizar",
                        icon: loadSVG(assetsPath, "eye-icon.svg"),
                        onclick: () => {
                            ScreenManager.setAtualScreen("view")
                        }
                    }),
                    Option({
                        text: "Configurações",
                        icon: loadSVG(assetsPath, "config-icon.svg"),
                        onclick: () => {
                            ScreenManager.setAtualScreen("config")
                        }
                    })
                ]
            })
        ]
    })
}