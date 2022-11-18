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
                    CreateElement('div', {
                        className: "lines",
                        content: [
                            CreateElement("span", {
                                content: "Modo escuro"
                            }),
                            switcher({
                                onToggle: (checked) => {
                                    api.toggleDarkMode()
                                    document.body.classList.toggle("dark")
                                    frame.updateTheme()
                                },
                                checked: api.options().darkMode
                            }),
                            CreateElement("span", {
                                content: "Tema do frame"
                            }),
                            CreateElement("select", {
                                className: "select",
                                content: [
                                    CreateElement("option", {
                                        content: "Automatico",
                                        value: "auto"
                                    }),
                                    CreateElement("option", {
                                        content: "Claro",
                                        value: "light"
                                    }),
                                    CreateElement("option", {
                                        content: "Escuro",
                                        value: "dark"
                                    })
                                ],
                                value: api.options().frameTheme,
                                onchange: (event) => {
                                    const frameTheme = event.currentTarget.value
                                    api.setFrameTheme(frameTheme)
                                    frame.updateTheme()
                                }
                            }),
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
                    CreateElement("div", {
                        className: "flex-center",
                        content: [
                            CreateElement("button", {
                                className: "stroke",
                                content: "Mostrar ferramentas de desenvolvedor",
                                onclick: () => {
                                    ipcRenderer.send("open-devtolls")
                                }
                            })
                        ]
                    })
                ]
            })
        ]
    })
}