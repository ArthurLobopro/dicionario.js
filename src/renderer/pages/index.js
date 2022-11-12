import { assetsPath, CreateElement, loadSVG } from "../../Util.js"
import { Page } from "../components/page.js"
import { ScreenManager } from "../ScreenManager.js"
import { Create } from "./Create.js"
import { View } from "./View.js"

function Option({ text, icon, onclick }) {
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
            `<header>
                <h1>Dicionário Pessoal</h1>
            </header>`,
            CreateElement("div", {
                className: "option-wrapper",
                content: [
                    Option({
                        text: "Adicionar",
                        icon: loadSVG(assetsPath, "add-icon.svg"),
                        onclick: () => {
                            ScreenManager.setAtualScreen(Create())
                        }
                    }),
                    Option({
                        text: "Visualizar",
                        icon: loadSVG(assetsPath, "eye-icon.svg"),
                        onclick: () => {
                            ScreenManager.setAtualScreen(View())
                        }
                    }),
                    // Option({
                    //     text: "Configurações",
                    //     icon: "../assets/config-icon.svg",
                    //     onclick: () => {
                    //         alert("config")
                    //     }
                    // })
                ]
            })
        ]
    })
}