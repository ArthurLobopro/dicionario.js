import { useState } from "react"
import { ZodError, z } from "zod"
import { api } from "../../store/Api"
import { Header } from "../components/Header"
import { Page } from "../components/Page"
import { ReturnButton } from "../components/ReturnButton"
import { AlertModal } from "../components/modals/Alert"
import { useModal } from "../hooks/useModal"

const create_word_schema = z.object({
    word: z.string().trim().min(3, "A palavra deve ter pelo menos 3 caracteres."),
    definition: z.string().trim().min(5, "A definição deve ter pelo menos 5 caracteres.")
})

export function CreateScreen() {
    const [data, setData] = useState({
        word: "",
        definition: ""
    })

    const modal = useModal()

    function SaveWord() {
        try {
            const send_data = create_word_schema.parse(data)

            api.words.SaveWord(send_data)

            modal.open(<AlertModal title="Sucesso" message="Palavra adicionada com sucesso!" onClose={() => {
                modal.hide()
                setData({
                    word: "",
                    definition: ""
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
                        value={data.word} onChange={e => setData({ ...data, word: e.target.value })}
                    />
                </label>
                <div className="t-wrapper grid-fill-bottom">
                    Significado
                    <textarea
                        id="sig" minLength={5} placeholder="Escreva os significados que a palavra pode ter."
                        value={data.definition} onChange={e => setData({ ...data, definition: e.target.value })}
                    ></textarea>
                </div>
                <button className="btn" onClick={SaveWord}>
                    Adicionar
                </button>
            </div>
        </Page>
    )
}