import { ipcRenderer } from "electron"
import { frameStyle } from "electron-frame/renderer"
import { api } from "../../store/Api"
import { frame } from "../Frame"
import { Header } from "../components/Header"
import { Page } from "../components/Page"
import { ReturnButton } from "../components/ReturnButton"
import { Switcher } from "../components/Switcher"
import { Alert } from "../components/modals/Alert"
import { useState } from "react"
import { StoreOptions } from "../../store/Schemas"

export function ConfigScreen() {
    const [config, setConfig] = useState<StoreOptions>(api.options)

    function ToggleTheme() {
        api.toggleDarkMode()
        document.body.classList.toggle("dark")
        frame.updateTheme()
    }

    function HandleFrameThemeChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const frameTheme = event.currentTarget.value as "auto" | "light" | "dark"
        api.setFrameTheme(frameTheme)
        setConfig({ ...config, frameTheme })
        frame.updateTheme()
    }

    function HandleFrameStyleChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const frameStyle = event.currentTarget.value as frameStyle
        api.setFrameStyle(frameStyle)
        setConfig({ ...config, frameStyle })
        frame.setFrameStyle(frameStyle)
    }

    function ImportWords() {
        try {
            api.importWords()
            new Alert({
                title: "Sucesso",
                message: "Palavras importadas com sucesso!"
            }).append(document.body)
        } catch (error: unknown) {
            console.log(error)

            new Alert({
                title: "Erro",
                message: (error as Error)?.message as string
            }).append(document.body)
        }
    }

    return (
        <Page id="config">
            <Header title="Configurações" left={<ReturnButton />} />
            <div className="dashed-border spacing-16">
                <div className="flex-column gap-10">
                    <div className="lines">
                        <span>Modo escuro</span>
                        <Switcher onToggle={ToggleTheme} checked={api.options.darkMode} />

                        <span>Tema do frame</span>
                        <select className="select" value={config.frameTheme} onChange={HandleFrameThemeChange}>
                            <option value="auto">Automatico</option>
                            <option value="light">Claro</option>
                            <option value="dark">Escuro</option>
                        </select>

                        <span>Estilo da janela</span>
                        <select className="select" value={config.frameStyle} onChange={HandleFrameStyleChange}>
                            <option value="windows">Windows</option>
                            <option value="macos">Macos</option>
                        </select>

                        <span>Exportar palavras</span>
                        <button
                            className="stroke"
                            onClick={async () => {
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
                            }}
                        >
                            Exportar
                        </button>

                        <span>Importar palavras</span>
                        <button className="stroke" onClick={ImportWords}>
                            Importar
                        </button>
                    </div>
                    <div className="flex-center">
                        <button className="stroke" onClick={() => ipcRenderer.send("open-devtolls")}>
                            Mostrar ferramentas de desenvolvedor
                        </button>
                    </div>
                </div>
                <span className="version">{`Versão ${api.version}`}</span>
            </div>
        </Page>
    )
}