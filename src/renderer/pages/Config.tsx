import { ipcRenderer, shell } from "electron"
import { frameStyle } from "electron-frame/renderer"
import { useEffect, useRef, useState } from "react"
import { api } from "../../store/Api"
import { StoreOptions } from "../../store/Schemas"
import { frame } from "../Frame"
import { Header } from "../components/Header"
import { Page } from "../components/Page"
import { ReturnButton } from "../components/ReturnButton"
import { Switcher } from "../components/Switcher"
import { AddIcon, DonwloadIcon, EditIcon, GithubLogo, TrashIcon, UploadIcon } from "../components/icons"
import { AlertModal } from "../components/modals/Alert"
import { WarningModal } from "../components/modals/Warning"
import { useModal } from "../hooks/useModal"
import { WordPicker } from "../components/modals/WordPicker"
import { LineTitle } from "../components/LineTitle"
import { AddDictionaryModal } from "../components/modals/AddDictionary"
import { DeleteDictionaryModal } from "../components/modals/DeleteDictionary"

const GITHUB_LINK = "https://github.com/ArthurLobopro/dicionario.js"

const isLinux = process.platform === "linux"

export function ConfigScreen() {
    const [config, setConfig] = useState<StoreOptions>(api.options.getOptions())

    const modal = useModal()

    const useSystemTitleBar = api.options.linux.useSystemTitleBar

    const wrapperRef = useRef<HTMLDivElement>(null)

    const [hasSrollbar, setHasScrollbar] = useState(false)

    useEffect(() => {
        const new_hasScrollbar = !!wrapperRef.current && wrapperRef.current?.scrollHeight > wrapperRef.current?.clientHeight

        if (hasSrollbar !== new_hasScrollbar) {
            setHasScrollbar(new_hasScrollbar)
        }
    }, [wrapperRef])

    function ToggleTheme() {
        api.options.toggleDarkMode()
        document.body.classList.toggle("dark")
        frame.updateTheme()
    }

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

    async function ExportWords() {
        modal.open(<WordPicker
            title="Selecione as palavras para exportar"
            onClose={(words) => {
                if (words.length === 0) {
                    return modal.hide()
                }
                const { status } = api.words.ExportWords(words)

                if (status === "canceled") {
                    return
                }

                if (status === "success") {
                    modal.open(<AlertModal title="Sucesso" message="Palavras exportadas com sucesso!" onClose={modal.hide} />)
                } else {
                    modal.open(<AlertModal title="Erro" message="Não foi possível exportar as palavras." onClose={modal.hide} />)
                }
            }}
        />)
    }

    function ImportWords() {
        try {
            const { status, count = 0 } = api.words.ImportWords()

            if (status === "canceled") {
                return
            }

            if (status === "success") {
                const message = count === 0 ?
                    "Nenhuma palavra foi importada." :
                    `${count} palavra${count > 1 ? "s" : ""} importada${count > 1 ? "s" : ""} com sucesso!`
                modal.open(<AlertModal title="Sucesso" message={message} onClose={modal.hide} />)
            }
        } catch (error: unknown) {
            console.log(error)
            modal.open(<AlertModal title="Erro" message={(error as Error)?.message as string} onClose={modal.hide} />)
        }
    }

    function DeleteDictionary() {
        modal.open(<DeleteDictionaryModal onClose={modal.hide} />)
    }

    function HandleAddDictionary() {
        modal.open(<AddDictionaryModal onClose={modal.hide} />)
    }

    return (
        <Page id="config">
            {modal.content}
            <Header title="Configurações" left={<ReturnButton />} />
            <div className="dashed-border">
                <div style={{ height: "100%", position: "relative" }}>
                    <div
                        className={`config-wrapper ${hasSrollbar ? "has-scrollbar" : ""}`}
                        ref={wrapperRef}
                    >
                        <div className="lines">
                            <span>Modo escuro</span>
                            <Switcher onToggle={ToggleTheme} checked={api.options.darkMode} />

                            <LineTitle title="Janela" />

                            {
                                isLinux && (
                                    <>
                                        <span>Usar titlebar do sistema</span>
                                        <Switcher
                                            onToggle={() => {
                                                api.options.toggleSystemTitleBar()
                                                ipcRenderer.send("relaunch")
                                            }}
                                            checked={useSystemTitleBar}
                                        />
                                    </>
                                )
                            }

                            <span>Estilo da titlebar</span>
                            <select
                                className="select"
                                value={config.frameStyle}
                                onChange={HandleFrameStyleChange}
                                disabled={useSystemTitleBar}
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
                                className="select"
                                value={config.frameTheme}
                                onChange={HandleFrameThemeChange}
                                disabled={useSystemTitleBar}
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

                            <LineTitle title="Dicionários" />

                            <span>Adicionar dicionário</span>
                            <button className="stroke" onClick={HandleAddDictionary} >
                                <AddIcon className="use-main-colors" />
                                Adicionar
                            </button>

                            <span>Editar dicionário</span>
                            <button className="stroke">
                                <EditIcon className="use-main-colors" />
                                Editar
                            </button>

                            <span className="warning">Deletar dicionário</span>
                            <button className="stroke warning" onClick={DeleteDictionary}>
                                <TrashIcon className="use-main-colors" />
                                Deletar
                            </button>


                            <LineTitle title="Outros" />

                            {/* <span>Exportar palavras</span>
                            <button className="stroke" onClick={ExportWords}>
                                <UploadIcon />
                                Exportar
                            </button>

                            <span>Importar palavras</span>
                            <button className="stroke" onClick={ImportWords}>
                                <DonwloadIcon />
                                Importar
                            </button> */}

                            <span>Sobre</span>
                            <button className="stroke" title="Abrir GitHub" onClick={() => shell.openExternal(GITHUB_LINK)}>
                                <GithubLogo />
                                Github
                            </button>

                            <button className="stroke fill-center" onClick={() => ipcRenderer.send("open-devtolls")}>
                                Mostrar ferramentas de desenvolvedor
                            </button>

                            {/* <LineTitle title="Área de Risco" className="warning" />

                            <span className="warning">Deletar dicionário</span>
                            <button className="stroke warning" onClick={DeleteDictionary}>
                                <TrashIcon className="use-main-colors" />
                                Deletar
                            </button> */}
                        </div>

                        <span className="version">{`Versão ${api.version}`}</span>
                    </div>
                </div>
            </div >
        </Page >
    )
}