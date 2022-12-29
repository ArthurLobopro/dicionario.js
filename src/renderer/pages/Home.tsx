import { AddIcon } from "../components/icons/Add"
import { EyeIcon } from "../components/icons/Eye"
import { ConfigIcon } from "../components/icons/Config"
import { Header } from "../components/Header"
import { Page } from "../components/Page"
import { useNavigate } from "react-router-dom"

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
                <Option text="Adicionar" icon={<AddIcon />} onclick={() => alert("Adicionar")} />
                <Option text="Visualizar" icon={<EyeIcon />} onclick={() => alert("Visualizar")} />
                <Option text="Configurações" icon={<ConfigIcon />} onclick={() => navigate("config")} />
            </div>
        </Page>
    )
}