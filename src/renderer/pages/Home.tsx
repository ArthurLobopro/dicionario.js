import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import { Page } from "../components/Page"
import { AddIcon, ConfigIcon, EyeIcon } from "../components/icons"

function Option({ text, icon, onclick }: { text: string; icon: JSX.Element; onclick: () => void }) {
    return (
        <div className="option" onClick={onclick}>
            <span>{text}</span>
            <div style={{ width: "30px", height: "30px" }}>
                {icon}
            </div>
        </div>
    )
}

export function Home() {
    const navigate = useNavigate()

    return (
        <Page id="home">
            <Header title="Dicionário Pessoal" />
            <div className="option-wrapper">
                <Option text="Adicionar" icon={<AddIcon />} onclick={() => navigate("create")} />
                <Option text="Visualizar" icon={<EyeIcon />} onclick={() => navigate("view")} />
                <Option text="Configurações" icon={<ConfigIcon />} onclick={() => navigate("config")} />
            </div>
        </Page>
    )
}