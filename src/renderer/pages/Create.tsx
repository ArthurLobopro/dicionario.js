import { useState } from "react"
import { api } from "../../store/Api"
import { Header } from "../components/Header"
import { Page } from "../components/Page"
import { ReturnButton } from "../components/ReturnButton"
import { Alert } from "../components/modals/Alert"

export function CreateScreen() {
    const [data, setData] = useState({
        palavra: "",
        definicao: ""
    })

    return (
        <Page id="create">
            <Header title="Adicionar Palavra" left={<ReturnButton />} />
            <div className="dashed-border spacing-16 grid-fill-center gap">
                <label>
                    Palavra
                    <input
                        type="text" id="word" placeholder="Palavra" minLength={3}
                        value={data.palavra} onChange={e => setData({ ...data, palavra: e.target.value })}
                    />
                </label>
                <div className="t-wrapper grid-fill-bottom">
                    Significado
                    <textarea
                        id="sig" minLength={5} placeholder="Escreva os significados que a palavra pode ter."
                        value={data.definicao} onChange={e => setData({ ...data, definicao: e.target.value })}
                    ></textarea>
                </div>
                <button
                    className="btn"
                    onClick={() => {
                        let { palavra, definicao } = data
                        palavra = palavra.trim()
                        definicao = definicao.trim()

                        if (palavra.length >= 3 && definicao.length >= 5) {
                            try {
                                api.createWord({
                                    palavra: palavra.trim(),
                                    definicao: definicao.trim()
                                })
                                new Alert({
                                    message: "Palavra adicionada com sucesso!",
                                    title: "Palavra Adicionada",
                                    onClose: () => {
                                        setData({
                                            palavra: "",
                                            definicao: ""
                                        })
                                    }
                                }).append(document.body)
                            } catch (error: unknown) {
                                new Alert({
                                    message: (error as Error).message,
                                    title: "Erro!"
                                }).append(document.body)
                            }
                        } else {
                            new Alert({
                                message: "Escreva uma palavra e uma descrição válida.",
                                title: "Erro!"
                            }).append(document.body)
                        }
                    }}
                >
                    Adicionar
                </button>
            </div>
        </Page>
    )
}