import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../../store/Api"
import { DictionaryController } from "../../store/Controllers/Dictionary"
import { Header } from "../components/Header"
import { Page } from "../components/Page"
import { ReturnButton } from "../components/ReturnButton"
import { ConfirmModal } from "../components/modals/Confirm"
import { ViewModal } from "../components/modals/View"
import { DictionaryInfoModal } from "../components/modals/dictionary"
import { SelectDictionary } from "../components/selects/Dictionary"
import { useModal } from "../hooks/useModal"

import {
    AddIcon,
    EditIcon,
    EyeIcon,
    GrayEmptyBookIcon,
    InfoIcon,
    NotFoundIcon,
    SearchIcon,
    TrashIcon
} from "../components/icons"
import { CircleButton } from "../components/CircleButton"

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

interface WordProps {
    word: {
        lastEdit?: Date | undefined
        definition: string
        register: Date,
        word: string
    }
    modal: ReturnType<typeof useModal>
    dictionary: DictionaryController
    reload: () => void
}

function Word(props: WordProps) {
    const { modal, word, dictionary, reload } = props

    function ShowViewModal() {
        modal.open(<ViewModal
            onClose={modal.close}
            dictionary={dictionary}
            word={word.word}
        />)
    }

    function DeleteWord() {
        modal.open(<ConfirmModal
            message="Essa ação é irreversível. Deseja realmente excluir esta palavra?"
            title="Você tem certeza?"
            onClose={(confirm) => {
                if (confirm) {
                    dictionary.Words.deleteWord(word.word)
                    reload()
                }
                modal.close()
            }}
        />)
    }

    const navigate = useNavigate()

    return (
        <div className="word" key={word.word} onDoubleClick={ShowViewModal}>
            <div className="content">
                <div className="word-header">
                    {word.word}
                </div>
                <div className="word-definition">
                    {word.definition}
                </div>
            </div>
            <div className="controls">
                <CircleButton title="Visualizar" onClick={ShowViewModal}>
                    <EyeIcon />
                </CircleButton>
                <CircleButton title="Editar"
                    onClick={() => {
                        navigate(`/update/${dictionary.name}/${word.word}`)
                    }}
                >
                    <EditIcon id="edit" />
                </CircleButton>
                <CircleButton title="Apagar" onClick={DeleteWord}>
                    <TrashIcon id="delete" />
                </CircleButton>
            </div>
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

    const [inputVisibility, setInputVisibility] = useState(false)

    const [search, setSearch] = useState("")

    const filter = new RegExp(`^${search}`)

    useEffect(() => {
        setWords(getWords())
    }, [dictionary])

    const navigate = useNavigate()
    const modal = useModal()

    function reloadWords() {
        setWords(Object.entries(dictionary.Words.words))
    }

    function showInfo() {
        modal.open(<DictionaryInfoModal
            dictionary={dictionary}
            onClose={modal.close}
        />)
    }

    const filtered_words = words.filter(([word]) => {
        return filter.test(word)
    })

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

    const search_input = (
        <input
            type="search" className="simple" placeholder="Pesquisar"
            onChange={(e) => {
                setSearch(e?.target.value)
            }}
            onBlur={(event) => {
                if (event.target.value === "") {
                    setInputVisibility(false)
                }
            }}
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