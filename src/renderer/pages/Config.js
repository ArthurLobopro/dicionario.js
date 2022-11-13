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
                className: "dashed-border spacing-16",
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
                    }),
                    CreateElement("div", {
                        className: "line",
                        content: [
                            CreateElement("span", {
                                content: "Estilo da janela"
                            }),
                            CreateElement("select", {
                                className: "select",
                                content: [
                                    CreateElement("option", {
                                        content: "Windows",
                                        value: "windows"
                                    }),
                                    CreateElement("option", {
                                        content: "Macos",
                                        value: "macos"
                                    }),
                                ],
                                value: api.options().frameStyle,
                                onchange: (event) => {
                                    const frameStyle = event.currentTarget.value
                                    api.setFrameStyle(frameStyle)
                                    frame.setFrameStyle(frameStyle)
                                }
                            })
                        ]
                    }),
                ]
            })
        ]
    })
}