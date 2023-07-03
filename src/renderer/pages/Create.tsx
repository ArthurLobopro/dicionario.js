import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { FieldErrors, useForm } from "react-hook-form"
import { useLocation, useParams } from "react-router-dom"
import { ZodError, z } from "zod"
import { api } from "../../store/Api"
import { frame } from "../Frame"
import { Form } from "../components/Form"
import { Header } from "../components/Header"
import { Page } from "../components/Page"
import { ReturnButton } from "../components/ReturnButton"
import { ValidatedInput } from "../components/ValidatedInput"
import { ErrorModal, SuccessModal, WarningModal } from "../components/modals"
import { SelectDictionary } from "../components/selects/Dictionary"
import { useModal } from "../hooks/useModal"

const create_word_schema = z.object({
    word: z.string({
        required_error: "Você deve fornecer uma palavra."
    }).trim().min(2, "A palavra deve ter pelo menos 2 caracteres.").transform(value => value.toLowerCase()),
    definition: z.string().trim().min(5, "Forneça uma definição com pelo menos 5 caracteres.")
})

type CreateWordData = z.infer<typeof create_word_schema>

export function CreateScreen() {

    const { search } = useLocation()

    const { dictionary: dictionary_name = "" } = useParams()

    const has_return_to = search.includes("return_to=")
    const return_to = has_return_to ? search.split("=")[1] : "/"

    const { register, handleSubmit, reset, watch } = useForm<CreateWordData>({
        resolver: zodResolver(create_word_schema),
        defaultValues: {
            word: "",
            definition: ""
        }
    })

    const [dictionary, setDictionary] = useState(() => {
        try {
            return api.dictionaries.getDictionary(dictionary_name as string)
        } catch (error) {
            return api.dictionaries.getDefaultDictionary()
        }
    })

    const { word, definition } = watch()

    const word_already_exists = !!dictionary.Words.getWord(word)

    const closeCallback = async (): Promise<boolean> => {
        return new Promise(resolve => {
            if (word.length || definition.length) {
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
    }, [word.length + definition.length > 0])

    const modal = useModal()

    function handleChangeDictionary(name: string) {
        setDictionary(api.dictionaries.getDictionary(name))
    }

    function onError(errors: FieldErrors) {
        const message = Object.values(errors).map(error => error?.message).join("\n")
        modal.open(<ErrorModal message={message} onClose={modal.close} />)
    }

    function onSubmit(data: CreateWordData) {
        try {
            api.dictionaries.getDictionary(dictionary.name).Words.addWord(data)

            modal.open(<SuccessModal
                message="Palavra adicionada com sucesso!"
                onClose={() => {
                    modal.close()
                    reset()
                }}
            />)
        } catch (error: unknown) {
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
        <Page id="create">
            {modal.content}
            <Header
                title="Adicionar Palavra"
                left={<ReturnButton
                    returnTo={has_return_to ? return_to : "/"}
                    onClick={closeCallback}
                />}
            />
            <Form
                className="dashed-border spacing-16 grid-fill-center gap"
                onSubmit={handleSubmit(onSubmit, onError)}
            >
                <label>
                    Salvar em
                    <SelectDictionary
                        disabled={!!dictionary_name}
                        default_value={dictionary.name}
                        onChange={handleChangeDictionary}
                    />
                </label>
                <label>
                    Palavra
                    <ValidatedInput
                        register={register("word")}
                        hasError={word_already_exists}
                        errorMessage={
                            word_already_exists ?
                                `A palavra "${word}" já existe neste dicionário.`
                                : ""
                        }
                        inputProps={{
                            placeholder: "Palavra",
                            tabIndex: 1
                        }}
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
                <button type="submit"
                    tabIndex={3}
                >
                    Adicionar
                </button>
            </Form>
        </Page>
    )
}