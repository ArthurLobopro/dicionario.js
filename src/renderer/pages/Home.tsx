import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DictionariesController } from "../../store/Controllers/Dictionaries"
import { Header, Page } from "../components/base"
import {
  AddIcon,
  BookIcon,
  ClearBookIcon,
  ConfigIcon,
  EyeIcon,
} from "../components/icons"

interface OptionProps {
  text: string
  icon: JSX.Element
  goTo: string
  preventBrightness?: boolean
}

function Option(props: OptionProps) {
  const { text, icon, goTo } = props
  const navigate = useNavigate()

  return (
    <div className="option" onClick={() => navigate(goTo)}>
      <div>{icon}</div>
      <span>{text}</span>
    </div>
  )
}

function getLinkQuery(search: { [key: string]: string }) {
  const query = new URLSearchParams()

  for (const index in search) {
    query.set(index, search[index])
  }

  return query.toString()
}

export function Home() {
  const navigate = useNavigate()

  const [topDictionaries] = useState(
    DictionariesController.getTopDictionaries(),
  )

  useEffect(() => {
    if (
      ["/view", "/create", "/config"].includes(sessionStorage.openIn as string)
    ) {
      navigate(sessionStorage.openIn)
      sessionStorage.removeItem("openIn")
    }
  }, [])

  return (
    <Page id="home">
      <Header title="Dicionário Pessoal" />
      <div className="option-wrapper">
        <Option
          text="Adicionar"
          icon={<AddIcon className="follow-colors" />}
          goTo="create"
        />
        <Option
          text="Visualizar"
          icon={<EyeIcon className="follow-colors" />}
          goTo="view"
        />
        {topDictionaries.map((dictionary) => (
          <Option
            text={dictionary.name}
            icon={
              dictionary.words.length ? (
                <BookIcon className="no-brightness" />
              ) : (
                <ClearBookIcon className="no-brightness" />
              )
            }
            goTo={`view?${getLinkQuery({ dictionary: dictionary.name })}`}
            key={dictionary.name}
          />
        ))}
        <Option
          text="Configurações"
          icon={<ConfigIcon className="follow-colors" />}
          goTo="config"
        />
      </div>
    </Page>
  )
}
