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
import { ErrorModal, SuccessModal, WarningModal } from "../components/modals"
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
    const returnTo = `/view?dictionary=${dictionary.name}`

    const navigate = useNavigate()
    const modal = useModal()

    const closeCallback = async (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (dirtyFields.definition || dirtyFields.word) {
                modal.open(
                    <WarningModal
                        onClose={(value) => {
                            resolve(value)
                            modal.close()
                        }}
                    >
                        Você tem certeza que deseja sair? Os dados não salvos serão perdidos.
                    </WarningModal>
                )
            } else {
                resolve(true)
            }
        })
    }

    useEffect(() => {
        frame.instance.setBeforeCloseCallback(closeCallback)

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
                navigate(returnTo)
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
            <Header title="Editar Palavra"
                left={<ReturnButton returnTo={returnTo} onClick={closeCallback} />}
            />
            <Form
                className="dashed-border spacing-16 grid-fill-center gap"
                onSubmit={handleSubmit(UpdateWord)}
            >
                <label>
                    Palavra
                    <input
                        type="text" placeholder="Palavra" minLength={3}
                        tabIndex={1}
                        {...register("word")}
                    />
                </label>
                <div className="t-wrapper grid-fill-bottom">
                    Significado
                    <textarea
                        minLength={5}
                        tabIndex={2}
                        placeholder="Significados que a palavra pode ter"
                        {...register("definition")}
                    ></textarea>
                </div>
                <button type="submit" tabIndex={3}>
                    Atualizar
                </button>
            </Form>
        </Page>
    )
}