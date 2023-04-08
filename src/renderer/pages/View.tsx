import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { api } from "../../store/Api"
import { Header } from "../components/Header"
import { Page } from "../components/Page"
import { ReturnButton } from "../components/ReturnButton"
import { ConfirmModal } from "../components/modals/Confirm"
import { ViewModal } from "../components/modals/View"
import { useModal } from "../hooks/useModal"
import { AddIcon, EditIcon, EyeIcon, GrayEmptyBookIcon, TrashIcon } from "../components/icons"
import { SelectDictionary } from "../components/selects/Dictionary"

export function ViewScreen() {
    const [dictionary, setDictionary] = useState(api.dictionaries.getDefaultDictionary())

    const getWords = () => Object.entries(dictionary.Words.words)

    const [words, setWords] = useState(getWords())

    useEffect(() => {
        setWords(getWords())
    }, [dictionary])

    const navigate = useNavigate()
    const modal = useModal()

    function ShowViewModal(word: string) {
        modal.open(<ViewModal
            onClose={modal.hide}
            dictionary={dictionary}
            word={word}
        />)
    }

    function DeleteWord(word: string) {
        modal.open(<ConfirmModal
            message="Essa ação é irreversível. Deseja realmente excluir esta palavra?"
            title="Você tem certeza?"
            onClose={(confirm) => {
                if (confirm) {
                    dictionary.Words.deleteWord(word)
                    setWords(Object.entries(dictionary.Words.words))
                }
                modal.hide()
            }}
        />)
    }

    const contents = {
        get words() {
            return (
                <div>
                    <div className="word-wrapper">
                        {words.map(([word, word_props]) => (
                            <div className="word" key={word}>
                                <div className="content">
                                    <div className="word-header">
                                        {word}
                                    </div>
                                    <div className="word-definition">
                                        {word_props.definition}
                                    </div>
                                </div>
                                <div className="controls">
                                    <div title="Visualizar" onClick={() => ShowViewModal(word)}>
                                        <EyeIcon />
                                    </div>
                                    <div title="Editar" id="edit"
                                        onClick={() => {
                                            navigate(`/update/${dictionary.name}/${word}`)
                                        }}
                                    >
                                        <EditIcon />
                                    </div>
                                    <div title="Apagar" id="delete" onClick={() => DeleteWord(word)}>
                                        <TrashIcon />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        get empty() {
            return (
                <div className="empty">

                    <GrayEmptyBookIcon />

                    <div className="empty-text">
                        Você ainda não cadastrou nenhuma palavra. Que tal começar agora?
                    </div>

                    <button onClick={() => navigate(`/create/${dictionary.name}?return_to=${atual_location}`)}>
                        Cadastrar Palavra
                    </button>
                </div>
            )
        }
    }

    const atual_location = window.location.href.split("#")[1]

    const add_button = (
        <AddIcon
            onClick={() => navigate(`/create/${dictionary.name}?return_to=${atual_location}`)}
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