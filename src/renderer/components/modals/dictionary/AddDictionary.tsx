import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { api } from "../../../../store/Api"
import { useModal } from "../../../hooks/useModal"
import { ErrorModal } from "../Error"
import { SuccessModal } from "../Success"
import { ModalWrapper } from "../Wrapper"

interface addDictionaryProps {
    onClose: () => void
}

const create_dictionary_schema = z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
    setDefault: z.boolean().default(false)
})

type createDictionaryProps = z.infer<typeof create_dictionary_schema>

export function AddDictionaryModal(props: addDictionaryProps) {
    const { register, handleSubmit } = useForm<createDictionaryProps>({
        resolver: zodResolver(create_dictionary_schema),
        defaultValues: {
            name: "",
            setDefault: false
        }
    })

    const modal = useModal()

    function onSubmit(data: createDictionaryProps) {
        try {
            api.dictionaries.addDictionary(data.name, data.setDefault)

            modal.open(<SuccessModal
                onClose={props.onClose}
                message="Dicionário criado com sucesso"
            />)
        } catch (error) {
            if (error instanceof Error) {
                modal.open(<ErrorModal
                    message={error.message}
                    onClose={modal.close}
                />)
            }
        }
    }

    return (
        <ModalWrapper>
            <form
                className="modal" id="add-dictionary"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="modal-header">
                    Adicionar Dicionário
                </div>
                <div className="modal-body">
                    {modal.content}
                    <div className="input-wrapper gap-10 flex-column">
                        <label>
                            Nome
                            <input
                                type="text" className="simple" placeholder="Nome do dicionário"
                                {...register("name")}
                            />
                        </label>

                        <label>
                            <span>Tornar padrão </span>
                            <input type="checkbox" {...register("setDefault")} />
                        </label>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="submit">
                        Adicionar
                    </button>
                    <button className="cancel" onClick={props.onClose}>
                        Cancelar
                    </button>
                </div>
            </form>
        </ModalWrapper>
    )
}