import { useState } from "react"
import { ZodError, z } from "zod"
import { api } from "../../store/Api"
import { Header } from "../components/Header"
import { Page } from "../components/Page"
import { ReturnButton } from "../components/ReturnButton"
import { AlertModal } from "../components/modals/Alert"
import { useModal } from "../hooks/useModal"

const create_word_schema = z.object({
    palavra: z.string().trim().min(3, "A palavra deve ter pelo menos 3 caracteres."),
    definicao: z.string().trim().min(5, "A definição deve ter pelo menos 5 caracteres.")
})

export function CreateScreen() {
    const [data, setData] = useState({
        palavra: "",
        definicao: ""
    })

    const modal = useModal()

    function SaveWord() {
        try {
            let { palavra, definicao } = create_word_schema.parse(data)

            api.createWord({
                palavra: palavra,
                definicao: definicao
            })

            modal.open(<AlertModal title="Sucesso" message="Palavra adicionada com sucesso!" onClose={() => {
                modal.hide()
                setData({
                    palavra: "",
                    definicao: ""
                })
            }} />)
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                const zod_error = error as ZodError
                modal.open(<AlertModal
                    title="Erro" onClose={modal.hide}
                    message={zod_error.issues.map(issue => issue.message).join("\n")}
                />)
            } else {
                modal.open(<AlertModal title="Erro" message={(error as Error).message} onClose={modal.hide} />)
            }
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