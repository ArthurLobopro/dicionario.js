import { useEffect, useState } from "react"
import { api } from "../../store/Api"
import { Header } from "../components/Header"
import { Page } from "../components/Page"
import { ReturnButton } from "../components/ReturnButton"
import { Confirm } from "../components/modals/Confirm"
import { ViewModal } from "../components/modals/View"
import { EyeIcon } from "../components/icons/Eye"
import { EditIcon } from "../components/icons/Edit"
import { DeleteIcon } from "../components/icons/Delete"
import { useNavigate } from "react-router-dom"


export function ViewScreen() {
    const [words, setWords] = useState(Object.entries(api.words))

    // const navigate = useNavigate()


    return (
        <Page id="view">
            <Header title="Visualizar Palavras" left={<ReturnButton />}></Header>
            <div style={{ position: "relative", marginBottom: 5 }}>
                <div className="word-wrapper">
                    {words.map(([word, word_props]) => (
                        <div className="word">
                            <div className="content">
                                <div className="word-header">
                                    {word}
                                </div>
                                <div className="word-definition">
                                    {word_props.definicao}
                                </div>
                            </div>
                            <div className="controls">
                                <div title="Visualizar"
                                    onClick={() => {
                                        const viewModal = ViewModal({
                                            word: word,
                                            onClose: () => {

                                            }
                                        })
                                        document.body.appendChild(viewModal)
                                    }}
                                >
                                    <EyeIcon />
                                </div>
                                <div title="Editar" id="edit"
                                    onClick={() => {
                                        // ScreenManager.setAtualScreen("update", { word: word })
                                        alert("Em desenvolvimento")
                                    }}
                                >
                                    <EditIcon />
                                </div>
                                <div title="Apagar" id="delete"
                                    onClick={() => {
                                        new Confirm({
                                            message: "Deseja realmente excluir esta palavra? Essa ação é irreversível.",
                                            onClose: (confirm) => {
                                                if (confirm) {
                                                    api.deleteWord(word)
                                                    setWords(Object.entries(api.words))
                                                }
                                            }
                                        }).append(document.body)
                                    }}
                                >
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