import { ipcRenderer, shell } from "electron"
import { frameStyle } from "electron-frame/renderer"
import { useEffect, useRef, useState } from "react"
import { api } from "../../store/Api"
import { StoreOptions } from "../../store/Schemas"
import { frame } from "../Frame"
import { hoverFocus } from "../Util"
import { Header } from "../components/Header"
import { LineTitle } from "../components/LineTitle"
import { Page } from "../components/Page"
import { ReturnButton } from "../components/ReturnButton"
import { Switcher } from "../components/Switcher"
import { AddIcon, DonwloadIcon, EditIcon, GithubLogo, TrashIcon, UploadIcon } from "../components/icons"
import { AddDictionaryModal } from "../components/modals/dictionary/AddDictionary"
import { DeleteDictionaryModal } from "../components/modals/dictionary/DeleteDictionary"
import { EditDictionaryModal } from "../components/modals/dictionary/EditDictionary"
import { ExportDictionaryModal } from "../components/modals/dictionary/ExportDictionary"
import { ImportDictionaryModal } from "../components/modals/dictionary/ImportDictionary"
import { useModal } from "../hooks/useModal"

const GITHUB_LINK = "https://github.com/ArthurLobopro/dicionario.js"

const isLinux = process.platform === "linux"

export function ConfigScreen() {
    const modal = useModal()

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

    const openGithub = () => shell.openExternal(GITHUB_LINK)
    const openDevtools = () => ipcRenderer.send("open-devtolls")

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

                            <WindowSection />

                            <DictionarySection modal={modal} />

                            <LineTitle title="Outros" />

                            <span>Sobre</span>
                            <button
                                className="stroke" title="Abrir GitHub"
                                onClick={openGithub} onMouseEnter={hoverFocus}
                            >
                                <GithubLogo />
                                Github
                            </button>

                            <button
                                className="stroke fill-center" title="Abrir ferramentas de desenvolvedor"
                                onClick={openDevtools} onMouseEnter={hoverFocus}
                            >
                                Mostrar ferramentas de desenvolvedor
                            </button>
                        </div>

                        <span className="version">{`Versão ${api.version}`}</span>
                    </div>
                </div>
            </div >
        </Page >
    )
}

interface sectionProps {
    modal: ReturnType<typeof useModal>
}

function WindowSection() {
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

            {
                isLinux && (
                    <>
                        <span>Usar titlebar do sistema</span>
                        <Switcher
                            onToggle={HandleToggleSystemTitlebar}
                            checked={useSystemTitleBar}
                        />
                    </>
                )
            }

            <span>Estilo da titlebar</span>
            <select
                className="select"
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
                className="select"
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

interface DictionarySectionsProps extends sectionProps { }

function DictionarySection(props: DictionarySectionsProps) {
    const { modal } = props

    function HandleAddDictionary() {
        modal.open(<AddDictionaryModal onClose={modal.close} />)
    }

    function HandleEditDictionary() {
        modal.open(<EditDictionaryModal onClose={modal.close} />)
    }

    function HandleDeleteDictionary() {
        modal.open(<DeleteDictionaryModal onClose={modal.close} />)
    }

    function HandleExportDictionary() {
        modal.open(<ExportDictionaryModal onClose={modal.close} />)
    }

    function HandleImportDictionary() {
        modal.open(<ImportDictionaryModal onClose={modal.close} />)
    }

    return (
        <>
            <LineTitle title="Dicionários" />

            <span>Adicionar dicionário</span>
            <button
                className="stroke" title="Adicionar um dicionário"
                onClick={HandleAddDictionary} onMouseEnter={hoverFocus}
            >
                <AddIcon className="use-main-colors" />
                Adicionar
            </button>

            <span>Editar dicionário</span>
            <button
                className="stroke" title="Editar um dicionário"
                onClick={HandleEditDictionary} onMouseEnter={hoverFocus}
            >
                <EditIcon className="use-main-colors" />
                Editar
            </button>

            <span className="warning">Deletar dicionário</span>
            <button
                className="stroke warning" title="Deletar um dicionário"
                onClick={HandleDeleteDictionary} onMouseEnter={hoverFocus}
            >
                <TrashIcon className="use-main-colors" />
                Deletar
            </button>

            <span>Exportar dicionário</span>
            <button
                className="stroke"
                onClick={HandleExportDictionary} onMouseEnter={hoverFocus}
            >
                <UploadIcon />
                Exportar
            </button>

            <span>Importar dicionário</span>
            <button
                className="stroke"
                onClick={HandleImportDictionary} onMouseEnter={hoverFocus}
            >
                <DonwloadIcon />
                Importar
            </button>
        </>
    )
}