import { ipcRenderer, shell } from "electron"
import { useEffect, useRef, useState } from "react"
import { api } from "../../store/Api"
import { frame } from "../Frame"
import { hoverFocus } from "../Util"
import { Header } from "../components/Header"
import { LineTitle } from "../components/LineTitle"
import { Page } from "../components/Page"
import { ReturnButton } from "../components/ReturnButton"
import { Switcher } from "../components/Switcher"
import { DictionarySection } from "../components/config-sections/DictionarySections"
import { WindowSection } from "../components/config-sections/Window"
import { GithubLogo } from "../components/icons"
import { useModal } from "../hooks/useModal"

const GITHUB_LINK = "https://github.com/ArthurLobopro/dicionario.js"

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

    function handleToggleTheme() {
        api.options.toggleDarkMode()
        document.body.classList.toggle("dark")
        frame.updateTheme()
    }

    function handleToggleAnimations() {
        api.options.toggleAnimations()
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
                            <LineTitle title="Aparência" />

                            <span>Modo escuro</span>
                            <Switcher onToggle={handleToggleTheme} checked={api.options.darkMode} />

                            <span>Animações</span>
                            <Switcher onToggle={handleToggleAnimations} checked={api.options.animations} />

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