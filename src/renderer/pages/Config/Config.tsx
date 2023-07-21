import { ipcRenderer, shell } from "electron"
import { useEffect, useRef, useState } from "react"
import { api } from "../../../store/Api"
import { hoverFocus } from "../../Util"
import { GithubLogo, LinkExternalIcon } from "../../components/icons"
import { useModal } from "../../hooks/useModal"
import { DictionarySection } from "./components/DictionarySection"
import { WindowSection } from "./components/WindowSection"

import { Header, LineTitle, Page, ReturnButton } from "../../components/base"
import { AppearanceSection } from "./components/AppearanceSection"

const GITHUB_LINK = "https://github.com/ArthurLobopro/dicionario.js"

export function ConfigScreen() {
  const modal = useModal()

  const wrapperRef = useRef<HTMLDivElement>(null)

  const [hasSrollbar, setHasScrollbar] = useState(false)

  useEffect(() => {
    const new_hasScrollbar =
      !!wrapperRef.current &&
      wrapperRef.current?.scrollHeight > wrapperRef.current?.clientHeight

    if (hasSrollbar !== new_hasScrollbar) {
      setHasScrollbar(new_hasScrollbar)
    }
  }, [wrapperRef])

  const openReport = () =>
    shell.openExternal("https://github.com/ArthurLobopro/dicionario.js/issues")
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
              <AppearanceSection />

              <WindowSection />

              <DictionarySection modal={modal} />

              <LineTitle title="Outros" />

              <span>Relatar erro</span>
              <button
                className="stroke"
                title="Relatar erro"
                onClick={openReport}
                onMouseEnter={hoverFocus}
              >
                <LinkExternalIcon />
                Abrir
              </button>

              <span>Sobre</span>
              <button
                className="stroke"
                title="Abrir GitHub"
                onClick={openGithub}
                onMouseEnter={hoverFocus}
              >
                <GithubLogo />
                Github
              </button>

              <button
                className="stroke fill-center"
                title="Abrir ferramentas de desenvolvedor"
                onClick={openDevtools}
                onMouseEnter={hoverFocus}
              >
                Mostrar ferramentas de desenvolvedor
              </button>
            </div>

            <span className="version">{`Versão ${api.version}`}</span>
          </div>
        </div>
      </div>
    </Page>
  )
}
