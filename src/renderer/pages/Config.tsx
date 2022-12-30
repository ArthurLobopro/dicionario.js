import { ipcRenderer } from "electron"
import { frameStyle } from "electron-frame/renderer"
import { api } from "../../store/Api"
import { frame } from "../Frame"
import { Header } from "../components/Header"
import { Page } from "../components/Page"
import { ReturnButton } from "../components/ReturnButton"
import { Switcher } from "../components/Switcher"
import { AlertModal } from "../components/modals/Alert"
import { useState } from "react"
import { StoreOptions } from "../../store/Schemas"
import { useModal } from "../hooks/useModal"

export function ConfigScreen() {
    const [config, setConfig] = useState<StoreOptions>(api.options)

    const modal = useModal()

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

    async function ExportWords() {
        const sucess = await api.exportWords()

        if (sucess === "canceled") {
            return
        }

        if (sucess) {
            modal.open(<AlertModal title="Sucesso" message="Palavras exportadas com sucesso!" onClose={modal.hide} />)
        } else {
            modal.open(<AlertModal title="Erro" message="Não foi possível exportar as palavras." onClose={modal.hide} />)
        }
    }

    function ImportWords() {
        try {
            api.importWords()
            modal.open(<AlertModal title="Sucesso" message="Palavras importadas com sucesso!" onClose={modal.hide} />)
        } catch (error: unknown) {
            console.log(error)
            modal.open(<AlertModal title="Erro" message={(error as Error)?.message as string} onClose={modal.hide} />)
        }
    }

    return (
        <Page id="config">
            {modal.content}
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
                        <button className="stroke" onClick={ExportWords}>
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