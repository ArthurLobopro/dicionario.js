import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ErrorModal, SuccessModal } from "../"
import { api } from "../../../../store/Api"
import { useModal } from "../../../hooks/useModal"
import { FormModal } from "../FormModal"

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
        <FormModal
            title="Adicionar dicionário" onClose={props.onClose} onSubmit={handleSubmit(onSubmit)}
            submitText="Adicionar"
        >
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
        </FormModal>
    )
}