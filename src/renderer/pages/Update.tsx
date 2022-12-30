import { useNavigate, useParams } from "react-router-dom"
import { api } from "../../store/Api"
import { Header } from "../components/Header"
import { Page } from "../components/Page"
import { ReturnButton } from "../components/ReturnButton"
import { AlertModal } from "../components/modals/Alert"
import { useState } from "react"
import { useModal } from "../hooks/useModal"

export function UpdateScreen() {
    const { word } = useParams()
    const [data, setData] = useState({
        palavra: word as string,
        definicao: api.words[word as keyof typeof api.words].definicao
    })

    const navigate = useNavigate()
    const modal = useModal()

    function UpdateWord() {
        try {
            api.updateWord(word as string, data)

            modal.open(<AlertModal title="Sucesso" message="Palavra atualizada com sucesso!" onClose={() => {
                modal.hide()
                navigate("/view")
            }} />)
        } catch (error: any) {
            modal.open(<AlertModal title="Erro" message={error.message} onClose={modal.hide} />)
        }
    }

    return (
        <Page id="edit">
            {modal.content}
            <Header title="Editar Palavra" left={<ReturnButton returnTo="/view" />} />
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
                <button className="btn" onClick={UpdateWord}>
                    Atualizar
                </button>
            </div>
        </Page>
    )
}