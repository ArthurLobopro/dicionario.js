import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { FieldErrors, useForm } from "react-hook-form"
import { useLocation, useParams } from "react-router-dom"
import { ZodError, z } from "zod"
import { api } from "../../store/Api"
import { Form } from "../components/Form"
import { Header } from "../components/Header"
import { Page } from "../components/Page"
import { ReturnButton } from "../components/ReturnButton"
import { AlertModal } from "../components/modals/Alert"
import { SuccessModal } from "../components/modals/Success"
import { SelectDictionary } from "../components/selects/Dictionary"
import { useModal } from "../hooks/useModal"

const create_word_schema = z.object({
    word: z.string().trim().min(2, "A palavra deve ter pelo menos 2 caracteres."),
    definition: z.string().trim().min(5, "Forneça uma definição com pelo menos 5 caracteres.")
})

type CreateWordData = z.infer<typeof create_word_schema>

export function CreateScreen() {

    const { search } = useLocation()

    const { dictionary: dictionary_name } = useParams()

    const has_return_to = search.includes("return_to=")
    const return_to = has_return_to ? search.split("=")[1] : "/"

    const { register, handleSubmit, reset } = useForm<CreateWordData>({
        resolver: zodResolver(create_word_schema),
        defaultValues: {
            word: "",
            definition: ""
        }
    })

    const has_dictionary = (
        () => {
            try {
                api.dictionaries.getDictionary(dictionary_name as string)
                return true
            } catch (error) {
                return false
            }
        }
    )()

    const [dictionary, setDictionary] = useState(
        has_dictionary ?
            api.dictionaries.getDictionary(dictionary_name as string) :
            api.dictionaries.getDefaultDictionary()
    )

    const modal = useModal()

    function handleChangeDictionary(name: string) {
        setDictionary(api.dictionaries.getDictionary(name))
    }

    function onError(errors: FieldErrors) {
        console.log(errors)
        const message = Object.values(errors).map(error => error?.message).join("\n")
        modal.open(<AlertModal title="Erro" message={message} onClose={modal.close} />)
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
        <Page id="create">
            {modal.content}
            <Header
                title="Adicionar Palavra"
                left={<ReturnButton
                    returnTo={has_return_to ? return_to : "/"}
                />}
            />
            <Form
                className="dashed-border spacing-16 grid-fill-center gap"
                onSubmit={handleSubmit(onSubmit, onError)}

            >
                <label>
                    Salvar em
                    <SelectDictionary
                        disabled={has_dictionary}
                        default_value={dictionary.name}
                        onChange={handleChangeDictionary}
                    />
                </label>
                <label>
                    Palavra
                    <input
                        type="text" id="word" placeholder="Palavra"
                        {...register("word")}
                        tabIndex={modal.isVisible ? -1 : 1}
                    />
                </label>
                <div className="t-wrapper grid-fill-bottom">
                    Significado
                    <textarea
                        id="sig" minLength={5}
                        tabIndex={modal.isVisible ? -1 : 2}
                        placeholder="Escreva os significados que a palavra pode ter."
                        {...register("definition")}
                    ></textarea>
                </div>
                <button type="submit"
                    tabIndex={modal.isVisible ? -1 : 3}
                >
                    Adicionar
                </button>
            </Form>
        </Page>
    )
}