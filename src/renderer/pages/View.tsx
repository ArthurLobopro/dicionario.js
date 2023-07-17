import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../../store/Api"
import { CircleButton } from "../components/CircleButton"
import { Header } from "../components/Header"
import { If } from "../components/If"
import { Page } from "../components/Page"
import { ReturnButton } from "../components/ReturnButton"
import { Word } from "../components/Word"
import { DictionaryInfoModal } from "../components/modals/dictionary"
import { SelectDictionary } from "../components/selects/Dictionary"
import { useModal } from "../hooks/useModal"
import { InputChangeEvent, InputFocusEvent } from "../types"

import {
  AddIcon,
  GrayEmptyBookIcon,
  InfoIcon,
  NotFoundIcon,
  SearchIcon,
} from "../components/icons"
import { useQuery } from "../hooks/useQuery"

interface EmptyPageProps {
  link: string
}

function EmptyPage(props: EmptyPageProps) {
  const { link } = props

  const navigate = useNavigate()

  return (
    <div className="empty">
      <GrayEmptyBookIcon />

      <div className="empty-text">
        Você ainda não cadastrou nenhuma palavra. Que tal começar agora?
      </div>

      <button onClick={() => navigate(link)}>Cadastrar Palavra</button>
    </div>
  )
}

interface EmptySearchProps {
  search: string
}

function EmptySearch(props: EmptySearchProps) {
  return (
    <div className="empty">
      <div>
        <NotFoundIcon />
      </div>
      A pesquisa "{props.search}" não encontrou nenhum resultado.
    </div>
  )
}

export function ViewScreen() {
  const query = useQuery()

  const [dictionary, setDictionary] = useState(() => {
    try {
      return api.dictionaries.getDictionary(query.get("dictionary") as string)
    } catch (error) {
      return api.dictionaries.getDefaultDictionary()
    }
  })

  const getWords = () => Object.entries(dictionary.Words.words)

  const [words, setWords] = useState(getWords())

  function reloadWords() {
    setWords(Object.entries(dictionary.Words.words))
  }

  useEffect(reloadWords, [dictionary])

  const [inputVisibility, setInputVisibility] = useState(false)

  const [search, setSearch] = useState("")

  const filter = useMemo(() => new RegExp(`^${search.trim()}`), [search])

  const navigate = useNavigate()
  const modal = useModal()

  function showInfo() {
    modal.open(
      <DictionaryInfoModal dictionary={dictionary} onClose={modal.close} />,
    )
  }

  const filtered_words = useMemo(() => {
    return words.filter(([word]) => filter.test(word))
  }, [filter, words])

  const word_list = useMemo(() => {
    return (
      <If
        condition={filtered_words.length > 0}
        else={<EmptySearch search={search} />}
      >
        <div>
          <div className="word-wrapper">
            {filtered_words.map(([word, word_props]) => (
              <Word
                word={{ ...word_props, word }}
                reload={reloadWords}
                dictionary={dictionary}
                modal={modal}
                key={word}
              />
            ))}
          </div>
        </div>
      </If>
    )
  }, [filtered_words])

  const atual_location = window.location.href.split("#")[1]
  const link = `/create/${dictionary.name}?return_to=${atual_location}`

  const search_input = useMemo(() => {
    const handle_change = (e: InputChangeEvent) => setSearch(e?.target.value)

    const handle_blur = (e: InputFocusEvent) => {
      e?.target.value === "" && setInputVisibility(false)
    }

    return (
      <input
        type="search"
        className="simple"
        placeholder="Pesquisar"
        onChange={handle_change}
        onBlur={handle_blur}
        value={search}
        autoFocus
      />
    )
  }, [search])

  const right_content = (
    <div className="flex gap-4">
      <div className="flex align-center">
        <If condition={words.length > 0}>
          <If condition={!inputVisibility} else={search_input}>
            <CircleButton
              title="Mostrar barra de pesquisa"
              onClick={() => setInputVisibility(true)}
            >
              <SearchIcon />
            </CircleButton>
          </If>
        </If>
      </div>
      <CircleButton onClick={showInfo} title="Informações do dicionário">
        <InfoIcon />
      </CircleButton>
      <CircleButton onClick={() => navigate(link)} title="Adicionar palavra">
        <AddIcon className="add-button" />
      </CircleButton>
    </div>
  )

  return (
    <Page id="view">
      {modal.content}
      <Header
        title={
          <SelectDictionary
            titleMode={true}
            onChange={(name: string) => {
              if (name !== dictionary.name) {
                setDictionary(api.dictionaries.getDictionary(name))
              }
            }}
            default_value={dictionary.name}
          />
        }
        left={<ReturnButton />}
        right={right_content}
      />

      <If condition={words.length > 0} else={<EmptyPage link={link} />}>
        {word_list}
      </If>
    </Page>
  )
}
