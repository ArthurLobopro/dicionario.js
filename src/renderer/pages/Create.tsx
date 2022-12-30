import { useState } from "react"
import { api } from "../../store/Api"
import { Header } from "../components/Header"
import { Page } from "../components/Page"
import { ReturnButton } from "../components/ReturnButton"
import { AlertModal } from "../components/modals/Alert"
import { useModal } from "../hooks/useModal"

export function CreateScreen() {
    const [data, setData] = useState({
        palavra: "",
        definicao: ""
    })

    const modal = useModal()

    function SaveWord() {
        let { palavra, definicao } = data
        palavra = palavra.trim()
        definicao = definicao.trim()

        if (palavra.length >= 3 && definicao.length >= 5) {
            try {
                api.createWord({
                    palavra: palavra.trim(),
                    definicao: definicao.trim()
                })

                modal.open(<AlertModal title="Sucesso" message="Palavra adicionada com sucesso!" onClose={() => {
                    modal.hide()
                    setData({
                        palavra: "",
                        definicao: ""
                    })
                }} />)
            } catch (error: unknown) {
                modal.open(<AlertModal title="Erro" message={(error as Error).message} onClose={modal.hide} />)
            }
        } else {
            modal.open(<AlertModal title="Erro" message="Escreva uma palavra e uma descrição válida." onClose={modal.hide} />)
        }
    }

    return (
        <Page id="create">
            {modal.content}
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
                <button className="btn" onClick={SaveWord}>
                    Adicionar
                </button>
            </div>
        </Page>
    )
}