import { ipcRenderer, shell } from "electron"
import { hoverFocus } from "../../../Util"
import { LineTitle } from "../../../components/base"
import { GithubLogo, LinkExternalIcon } from "../../../components/icons"

const GITHUB_LINK = "https://github.com/ArthurLobopro/dicionario.js"

const openDevtools = () => ipcRenderer.send("open-devtolls")
const openGithub = () => shell.openExternal(GITHUB_LINK)
const openReport = () => shell.openExternal(`${GITHUB_LINK}/issues`)

export function OthersSection() {
  return (
    <>
      <LineTitle title="Outros" />

      <span>Relatar erro</span>
      <button
        className="stroke"
        title="Relatar erro"
        onClick={openReport}
        onMouseEnter={hoverFocus}
      >
        <LinkExternalIcon className="use-main-colors" />
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
    </>
  )
}
