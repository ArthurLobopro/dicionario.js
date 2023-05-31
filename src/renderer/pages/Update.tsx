import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { ZodError, z } from "zod"
import { api } from "../../store/Api"
import { frame } from "../Frame"
import { Form } from "../components/Form"
import { Header } from "../components/Header"
import { Page } from "../components/Page"
import { ReturnButton } from "../components/ReturnButton"
import { ConfirmModal } from "../components/modals/Confirm"
import { ErrorModal } from "../components/modals/Error"
import { SuccessModal } from "../components/modals/Success"
import { useModal } from "../hooks/useModal"

const update_word_schema = z.object({
    word: z.string().trim().min(2, "A palavra deve ter pelo menos 2 caracteres.").transform(value => value.toLowerCase()),
    definition: z.string().trim().min(5, "Forneça uma definição com pelo menos 5 caracteres.")
})

type UpdateWordData = z.infer<typeof update_word_schema>

export function UpdateScreen() {
    const { word, dictionary: dictionary_name } = useParams()

    const { register, handleSubmit, watch, formState: { dirtyFields } } = useForm<UpdateWordData>({
        resolver: zodResolver(update_word_schema),
        defaultValues: {
            word: word as string,
            definition: api.dictionaries.getDictionary(dictionary_name as string).Words.getWord(word as string)?.definition
        }
    })

    const dictionary = api.dictionaries.getDictionary(dictionary_name as string)

    const navigate = useNavigate()

    const modal = useModal()

    useEffect(() => {
        const callback = async (): Promise<boolean> => {
            return new Promise((resolve) => {
                if (dirtyFields.definition || dirtyFields.word) {
                    modal.open(<ConfirmModal
                        message="Você tem certeza que deseja sair? Os dados não salvos serão perdidos."
                        onClose={value => {
                            modal.close()
                            resolve(value)
                        }}
                    />)
                } else {
                    resolve(true)
                }
            })
        }

        frame.instance.setBeforeCloseCallback(callback)

        return () => {
            frame.instance.setBeforeCloseCallback()
        }
    }, [dirtyFields])

    function UpdateWord(data: UpdateWordData) {
        try {
            dictionary.Words.updateWord(
                word as string,
                {
                    ...data,
                    new_word: data.word
                }
            )

            function handleClose() {
                modal.close()
                navigate("/view")
            }

            modal.open(<SuccessModal
                message="Palavra atualizada com sucesso!"
                onClose={handleClose}
            />)

        } catch (error: any) {
            console.log(error)
            if (error instanceof ZodError) {
                const zod_error = error as ZodError
                const message = zod_error.issues.map(issue => issue.message).join("\n")
                modal.open(<ErrorModal onClose={modal.close} message={message} />)
            } else {
                const message = (error as Error).message
                modal.open(<ErrorModal message={message} onClose={modal.close} />)
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
                        type="text" placeholder="Palavra" minLength={3}
                        tabIndex={modal.isVisible ? -1 : 1}
                        {...register("word")}
                    />
                </label>
                <div className="t-wrapper grid-fill-bottom">
                    Significado
                    <textarea
                        minLength={5}
                        tabIndex={modal.isVisible ? -1 : 2}
                        placeholder="Significados que a palavra pode ter"
                        {...register("definition")}
                    ></textarea>
                </div>
                <button type="submit" tabIndex={modal.isVisible ? -1 : 3}>
                    Atualizar
                </button>
            </Form>
        </Page>
    )
}