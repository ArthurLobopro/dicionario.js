import { CreateElement } from "../../Util.js"
import { Page } from "../components/page.js"

function Option({ text, icon, onclick }) {
    return CreateElement("div", {
        className: "option",
        content: [
            CreateElement("span", {
                content: text
            }),
            CreateElement("img", {
                src: icon,
                width: "30"
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
                        icon: "../assets/add-icon.svg",
                        onclick: () => {
                            alert("add")
                        }
                    }),
                    Option({
                        text: "Visualizar",
                        icon: "../assets/eye-icon.svg",
                        onclick: () => {
                            alert("view")
                        }
                    }),
                    Option({
                        text: "Configurações",
                        icon: "../assets/config-icon.svg",
                        onclick: () => {
                            alert("config")
                        }
                    })
                ]
            })
        ]
    })
}