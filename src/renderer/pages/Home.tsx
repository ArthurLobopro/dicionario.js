import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import { Page } from "../components/Page"
import { AddIcon, ConfigIcon, EyeIcon } from "../components/icons"

interface OptionProps {
    text: string
    icon: JSX.Element
    goTo: string
}

function Option(props: OptionProps) {
    const { text, icon, goTo } = props
    const navigate = useNavigate()

    return (
        <div className="option" onClick={() => navigate(goTo)}>
            <span>{text}</span>
            <div style={{ width: "30px", height: "30px" }}>
                {icon}
            </div>
        </div>
    )
}

export function Home() {

    return (
        <Page id="home">
            <Header title="Dicionário Pessoal" />
            <div className="option-wrapper">
                <Option text="Adicionar" icon={<AddIcon />} goTo="create" />
                <Option text="Visualizar" icon={<EyeIcon />} goTo="view" />
                <Option text="Configurações" icon={<ConfigIcon />} goTo="config" />
            </div>
        </Page>
    )
}