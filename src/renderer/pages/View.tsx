import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../../store/Api"
import { Header } from "../components/Header"
import { Page } from "../components/Page"
import { ReturnButton } from "../components/ReturnButton"
import { ConfirmModal } from "../components/modals/Confirm"
import { ViewModal } from "../components/modals/View"
import { SelectDictionary } from "../components/selects/Dictionary"
import { useModal } from "../hooks/useModal"

import { DictionaryController } from "../../store/Controllers/Dictionary"
import { StoreWord } from "../../store/Schemas"
import {
    AddIcon,
    EditIcon,
    EyeIcon,
    GrayEmptyBookIcon,
    TrashIcon
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
                <div title="Visualizar" onClick={ShowViewModal}>
                    <EyeIcon />
                </div>
                <div title="Editar" id="edit"
                    onClick={() => {
                        navigate(`/update/${dictionary.name}/${word.word}`)
                    }}
                >
                    <EditIcon />
                </div>
                <div title="Apagar" id="delete" onClick={DeleteWord}>
                    <TrashIcon />
                </div>
            </div>
        </div>
    )
}

export function ViewScreen() {
    const [dictionary, setDictionary] = useState(api.dictionaries.getDefaultDictionary())

    const getWords = () => Object.entries(dictionary.Words.words)

    const [words, setWords] = useState(getWords())

    useEffect(() => {
        setWords(getWords())
    }, [dictionary])

    const navigate = useNavigate()
    const modal = useModal()

    function reloadWords() {
        setWords(Object.entries(dictionary.Words.words))
    }

    const contents = {
        get words() {
            return (
                <div>
                    <div className="word-wrapper">
                        {words.map(([word, word_props]) => (
                            <Word
                                word={{ ...word_props, word }}
                                reload={reloadWords}
                                dictionary={dictionary}
                                modal={modal}
                            />
                        ))}
                    </div>
                </div>
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

    const add_button = (
        <AddIcon
            onClick={() => navigate(link)}
            title="Adicionar palavra"
            className="add-button"
        />
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
                right={add_button}
            />
            {words.length > 0 ? contents.words : contents.empty}
        </Page>
    )
}