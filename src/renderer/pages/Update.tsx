import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { ZodError, z } from "zod"
import { api } from "../../store/Api"
import { Form } from "../components/Form"
import { Header } from "../components/Header"
import { Page } from "../components/Page"
import { ReturnButton } from "../components/ReturnButton"
import { AlertModal } from "../components/modals/Alert"
import { SuccessModal } from "../components/modals/Success"
import { useModal } from "../hooks/useModal"

const update_word_schema = z.object({
    word: z.string().trim().min(2, "A palavra deve ter pelo menos 2 caracteres."),
    definition: z.string().trim().min(5, "Forneça uma definição com pelo menos 5 caracteres.").transform(value => value.toLowerCase())
})

type UpdateWordData = z.infer<typeof update_word_schema>

export function UpdateScreen() {
    const { word, dictionary: dictionary_name } = useParams()

    const { register, handleSubmit } = useForm<UpdateWordData>({
        resolver: zodResolver(update_word_schema),
        defaultValues: {
            word: word as string,
            definition: api.dictionaries.getDictionary(dictionary_name as string).Words.getWord(word as string)?.definition
        }
    })

    const dictionary = api.dictionaries.getDictionary(dictionary_name as string)

    const navigate = useNavigate()

    const modal = useModal()

    const hasModal = !!modal.content

    function UpdateWord(data: UpdateWordData) {
        try {

            dictionary.Words.updateWord(
                word as string,
                {
                    ...data,
                    new_word: data.word
                }
            )

            modal.open(<SuccessModal message="Palavra atualizada com sucesso!" onClose={() => {
                modal.close()
                navigate("/view")
            }} />)

        } catch (error: any) {
            console.log(error)
            if (error instanceof ZodError) {
                const zod_error = error as ZodError
                modal.open(<AlertModal
                    title="Erro" onClose={modal.close}
                    message={zod_error.issues.map(issue => issue.message).join("\n")}
                />)
            } else {
                modal.open(<AlertModal title="Erro" message={(error as Error).message} onClose={modal.close} />)
            }
        }
    }

    return (
        <Page id="edit">
            {modal.content}
            <Header title="Editar Palavra" left={<ReturnButton returnTo="/view" />} />
            <Form
                className="dashed-border spacing-16 grid-fill-center gap"
                onSubmit={handleSubmit(UpdateWord)}
            >
                <label>
                    Palavra
                    <input
                        type="text" id="word" placeholder="Palavra" minLength={3}
                        tabIndex={hasModal ? -1 : 1} {...register("word")}
                    />
                </label>
                <div className="t-wrapper grid-fill-bottom">
                    Significado
                    <textarea
                        id="sig" minLength={5}
                        tabIndex={hasModal ? -1 : 2}
                        placeholder="Escreva os significados que a palavra pode ter."
                        {...register("definition")}
                    ></textarea>
                </div>
                <button type="submit" tabIndex={hasModal ? -1 : 3}>
                    Atualizar
                </button>
            </Form>
        </Page>
    )
}