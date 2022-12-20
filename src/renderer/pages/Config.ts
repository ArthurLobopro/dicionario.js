import { ipcRenderer } from "electron"
import { frameStyle } from "electron-frame/renderer"
import { CreateElement } from "../../Util"
import { api } from "../../store/Api"
import { frame } from "../Frame"
import { Header } from "../components/Header"
import { Page } from "../components/Page"
import { ReturnButton } from "../components/ReturnButton"
import { switcher } from "../components/Switcher"
import { Alert } from "../components/modals/Alert"

export function Config() {
    return Page({
        id: "config",
        content: [
            Header({
                title: "Configurações",
                left: ReturnButton()
            }),
            CreateElement("div", {
                className: "dashed-border spacing-16",
                content: [
                    CreateElement("div", {
                        className: "flex-column gap-10",
                        content: [
                            CreateElement('div', {
                                className: "lines",
                                content: [
                                    CreateElement("span", {
                                        content: "Modo escuro"
                                    }),
                                    switcher({
                                        onToggle: () => {
                                            api.toggleDarkMode()
                                            document.body.classList.toggle("dark")
                                            frame.updateTheme()
                                        },
                                        checked: api.options.darkMode as boolean
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
                                        value: api.options.frameTheme,
                                        onchange: (event: InputEvent) => {
                                            const frameTheme = (event.currentTarget as HTMLSelectElement).value as "auto" | "light" | "dark"
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
                                        value: api.options.frameStyle,
                                        onchange: (event: InputEvent) => {
                                            const frameStyle = (event.currentTarget as HTMLSelectElement).value as frameStyle
                                            api.setFrameStyle(frameStyle)
                                            frame.setFrameStyle(frameStyle)
                                        }
                                    }),
                                    CreateElement("span", {
                                        content: "Exportar palavras"
                                    }),
                                    CreateElement("button", {
                                        className: "stroke",
                                        content: "Exportar",
                                        onclick: async () => {
                                            const sucess = await api.exportWords()

                                            if (sucess === "canceled") {
                                                return
                                            }

                                            if (sucess) {
                                                new Alert({
                                                    title: "Sucesso",
                                                    message: "Palavras exportadas com sucesso!"
                                                }).append(document.body)
                                            } else {
                                                new Alert({
                                                    title: "Erro",
                                                    message: "Ocorreu um erro ao exportar as palavras!"
                                                }).append(document.body)
                                            }
                                        }
                                    }),
                                    CreateElement("span", {
                                        content: "Importar palavras"
                                    }),
                                    CreateElement("button", {
                                        className: "stroke",
                                        content: "Importar",
                                        onclick: async () => {
                                            try {
                                                api.importWords()
                                                new Alert({
                                                    title: "Sucesso",
                                                    message: "Palavras importadas com sucesso!"
                                                })
                                            } catch (error: unknown) {
                                                new Alert({
                                                    title: "Erro",
                                                    message: (error as Error)?.message as string
                                                })
                                            }
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
                            }),
                        ]
                    }),

                    CreateElement("span", {
                        className: "version",
                        content: `Versão ${api.version}`
                    })
                ]
            })
        ]
    })
}