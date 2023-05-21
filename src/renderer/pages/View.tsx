import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../../store/Api"
import { CircleButton } from "../components/CircleButton"
import { Header } from "../components/Header"
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
    SearchIcon
} from "../components/icons"

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

            <button onClick={() => navigate(link)}>
                Cadastrar Palavra
            </button>
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
    const [dictionary, setDictionary] = useState(api.dictionaries.getDefaultDictionary())

    const getWords = () => Object.entries(dictionary.Words.words)

    const [words, setWords] = useState(getWords())

    function reloadWords() {
        setWords(Object.entries(dictionary.Words.words))
    }

    useEffect(reloadWords, [dictionary])

    const [inputVisibility, setInputVisibility] = useState(false)

    const [search, setSearch] = useState("")

    const filter = new RegExp(`^${search.trim()}`)

    const navigate = useNavigate()
    const modal = useModal()

    function showInfo() {
        modal.open(<DictionaryInfoModal
            dictionary={dictionary}
            onClose={modal.close}
        />)
    }

    const filtered_words = words.filter(([word]) => filter.test(word))

    const contents = {
        get words() {
            return filtered_words.length ? (
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
            ) : (
                <EmptySearch search={search} />
            )
        },
        get empty() {
            return (
                <EmptyPage link={link} />
            )
        }
    }

    const atual_location = window.location.href.split("#")[1]
    const link = `/create/${dictionary.name}?return_to=${atual_location}`

    const handle_search_input_change = (e: InputChangeEvent) => setSearch(e?.target.value)
    const handle_search_input_blur = (e: InputFocusEvent) => {
        e?.target.value === "" && setInputVisibility(false)
    }

    const search_input = (
        <input
            type="search" className="simple" placeholder="Pesquisar"
            onChange={handle_search_input_change}
            onBlur={handle_search_input_blur}
            autoFocus
        />
    )

    const right_content = (
        <div className="flex gap-4">
            <div className="flex align-center">
                {
                    words.length > 0 && (
                        inputVisibility ?
                            search_input :
                            <CircleButton
                                title="Mostrar barra de pesquisa"
                                onClick={() => setInputVisibility(true)}
                            >
                                <SearchIcon />
                            </CircleButton>
                    )
                }
            </div>
            <CircleButton
                onClick={showInfo}
                title="Informações do dicionário"
            >
                <InfoIcon />
            </CircleButton>
            <CircleButton
                onClick={() => navigate(link)}
                title="Adicionar palavra"
            >
                <AddIcon className="add-button" />
            </CircleButton>
        </div>
    )

    return (
        <Page id="view">
            {modal.content}
            <Header
                title={<SelectDictionary titleMode={true}
                    onChange={(name: string) => {
                        if (name !== dictionary.name) {
                            setDictionary(api.dictionaries.getDictionary(name))
                        }
                    }} />
                }
                left={<ReturnButton />}
                right={right_content}
            />
            {words.length > 0 ? contents.words : contents.empty}
        </Page>
    )
}