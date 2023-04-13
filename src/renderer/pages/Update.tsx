import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ZodError, z } from "zod"
import { api } from "../../store/Api"
import { Header } from "../components/Header"
import { Page } from "../components/Page"
import { ReturnButton } from "../components/ReturnButton"
import { AlertModal } from "../components/modals/Alert"
import { useModal } from "../hooks/useModal"
import { SuccessModal } from "../components/modals/Success"

const update_word_schema = z.object({
    word: z.string().trim().min(3, "A palavra deve ter pelo menos 3 caracteres."),
    definition: z.string().trim().min(5, "A definição deve ter pelo menos 5 caracteres.")
})

export function UpdateScreen() {
    const { word, dictionary: dictionary_name } = useParams()

    const dictionary = api.dictionaries.getDictionary(dictionary_name as string)

    const [data, setData] = useState({
        word: word as string,
        definition: dictionary.Words.getWord(word as string).definition
    })

    const navigate = useNavigate()
    const modal = useModal()

    function UpdateWord() {
        try {
            const send_data = update_word_schema.parse(data)

            dictionary.Words.updateWord(word as string, { ...send_data, new_word: send_data.word, })

            modal.open(<SuccessModal message="Palavra atualizada com sucesso!" onClose={() => {
                modal.hide()
                navigate("/view")
            }} />)

        } catch (error: any) {
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
        <Page id="edit">
            {modal.content}
            <Header title="Editar Palavra" left={<ReturnButton returnTo="/view" />} />
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
                <button className="btn" onClick={UpdateWord}>
                    Atualizar
                </button>
            </div>
        </Page>
    )
}