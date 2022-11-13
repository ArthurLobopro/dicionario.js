import { CreateElement } from "../../Util.js"
import { Header } from "../components/Header.js"
import { Page } from "../components/page.js"
import { switcher } from "../components/switch.js"

export function Config() {
    return Page({
        id: "config",
        content: [
            Header({
                title: "Configurações"
            }),
            CreateElement("div", {
                className: "dashed-border spacing-16 grid-fill-center gap",
                content: [
                    CreateElement("div", {
                        className: "line",
                        content: [
                            CreateElement("span", {
                                content: "Modo escuro"
                            }),
                            switcher({
                                onToggle: (checked) => {
                                    api.toggleDarkMode()
                                    document.body.classList.toggle("dark")
                                },
                                checked: api.options().darkMode
                            }),
                        ]
                    })
                ]
            })
        ]
    })
}