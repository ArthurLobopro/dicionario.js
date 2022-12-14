import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../../store/Api"
import { Header } from "../components/Header"
import { Page } from "../components/Page"
import { ReturnButton } from "../components/ReturnButton"
import { DeleteIcon } from "../components/icons/Delete"
import { EditIcon } from "../components/icons/Edit"
import { EyeIcon } from "../components/icons/Eye"
import { ConfirmModal } from "../components/modals/Confirm"
import { ViewModal } from "../components/modals/View"
import { useModal } from "../hooks/useModal"

export function ViewScreen() {
    const [words, setWords] = useState(Object.entries(api.words))

    const navigate = useNavigate()
    const modal = useModal()

    function ShowViewModal(word: string) {
        modal.open(<ViewModal word={word} onClose={modal.hide} />)
    }

    function DeleteWord(word: string) {
        modal.open(<ConfirmModal
            message="Deseja realmente excluir esta palavra? Essa ação é irreversível."
            onClose={(confirm) => {
                if (confirm) {
                    api.deleteWord(word)
                    setWords(Object.entries(api.words))
                }
                modal.hide()
            }}
        />)
    }

    return (
        <Page id="view">
            {modal.content}
            <Header title="Visualizar Palavras" left={<ReturnButton />}></Header>
            <div style={{ position: "relative", marginBottom: 5 }}>
                <div className="word-wrapper">
                    {words.map(([word, word_props]) => (
                        <div className="word" key={word}>
                            <div className="content">
                                <div className="word-header">
                                    {word}
                                </div>
                                <div className="word-definition">
                                    {word_props.definicao}
                                </div>
                            </div>
                            <div className="controls">
                                <div title="Visualizar" onClick={() => ShowViewModal(word)}>
                                    <EyeIcon />
                                </div>
                                <div title="Editar" id="edit"
                                    onClick={() => {
                                        navigate(`/update/${word}`)
                                    }}
                                >
                                    <EditIcon />
                                </div>
                                <div title="Apagar" id="delete" onClick={() => DeleteWord(word)}>
                                    <DeleteIcon />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Page>
    )
}