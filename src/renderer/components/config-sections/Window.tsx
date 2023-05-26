import { ipcRenderer } from "electron"
import { frameStyle } from "electron-frame"
import { useState } from "react"
import { api } from "../../../store/Api"
import { StoreOptions } from "../../../store/ZodSchemas/options"
import { frame } from "../../Frame"
import { hoverFocus } from "../../Util"
import { LineTitle } from "../LineTitle"
import { Switcher } from "../Switcher"

const isLinux = process.platform === "linux"

export function WindowSection() {
    const [config, setConfig] = useState<StoreOptions>(api.options.getOptions())

    const useSystemTitleBar = api.options.linux.useSystemTitleBar

    function HandleFrameThemeChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const frameTheme = event.currentTarget.value as "auto" | "light" | "dark"
        api.options.setFrameTheme(frameTheme)
        setConfig({ ...config, frameTheme })
        frame.updateTheme()
    }

    function HandleFrameStyleChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const frameStyle = event.currentTarget.value as frameStyle
        api.options.setFrameStyle(frameStyle)
        setConfig({ ...config, frameStyle })
        frame.setFrameStyle(frameStyle)
    }

    function HandleToggleSystemTitlebar() {
        api.options.toggleSystemTitleBar()
        ipcRenderer.send("relaunch")
    }

    return (
        <>
            <LineTitle title="Janela" />

            {isLinux && (
                <>
                    <span>Usar titlebar do sistema</span>
                    <Switcher
                        onToggle={HandleToggleSystemTitlebar}
                        checked={useSystemTitleBar}
                        title={
                            useSystemTitleBar ?
                                "Desativar titlebar do sistema" :
                                "Ativar titlebar do sistema"
                        }
                    />
                </>
            )}

            <span>Estilo da titlebar</span>
            <select
                value={config.frameStyle}
                disabled={useSystemTitleBar}
                onChange={HandleFrameStyleChange}
                onMouseEnter={hoverFocus}
                title={
                    useSystemTitleBar ?
                        "Desative a opção 'Usar titlebar do sistema' para alterar o estilo da titlebar" :
                        "Alterar o estilo da titlebar"
                }
            >
                <option value="windows">Windows</option>
                <option value="macos">Macos</option>
            </select>

            <span>Tema da titlebar</span>
            <select
                value={config.frameTheme}
                disabled={useSystemTitleBar}
                onChange={HandleFrameThemeChange}
                onMouseEnter={hoverFocus}
                title={
                    useSystemTitleBar ?
                        "Desative a opção 'Usar titlebar do sistema' para alterar o tema da titlebar" :
                        "Alterar o tema da titlebar"
                }
            >
                <option value="auto">Automatico</option>
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
            </select>
        </>
    )
}