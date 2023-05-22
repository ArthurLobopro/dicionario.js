import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { api } from "../../../../store/Api"
import { useModal } from "../../../hooks/useModal"
import { SelectDictionary } from "../../selects/Dictionary"
import { SuccessModal } from "../Success"
import { ModalWrapper } from "../Wrapper"

interface editDictionaryProps {
    onClose: () => void
}

const edit_dictionary_schema = z.object({
    newName: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
    setDefault: z.boolean()
})

type edit_dictionary_props = z.infer<typeof edit_dictionary_schema>

export function EditDictionaryModal(props: editDictionaryProps) {
    const [currentDictionary, setCurrentDictionary] = useState(api.dictionaries.getDictionaries()[0])

    const default_dictionary_name = api.dictionaries.getDefaultDictionary().name

    const editing_default = currentDictionary.name === default_dictionary_name

    const modal = useModal()

    const { register, handleSubmit, resetField, setValue } = useForm<edit_dictionary_props>({
        resolver: zodResolver(edit_dictionary_schema),
        defaultValues: {
            newName: currentDictionary.name,
            setDefault: false
        }
    })

    useEffect(() => {
        const name = currentDictionary.name

        setValue("newName", name)
        if (name === default_dictionary_name) {
            setValue("setDefault", false)
        }
    }, [currentDictionary])

    function onSubmit(data: edit_dictionary_props) {
        api.dictionaries.editDictionary(currentDictionary.name, data)

        modal.open(<SuccessModal message="Dicionário editado com sucesso!" onClose={props.onClose} />)
    }

    return (
        <ModalWrapper>
            <form className="modal" id="add-dictionary" onSubmit={handleSubmit(onSubmit)}>
                {modal.content}
                <div className="modal-header">
                    Editar Dicionário
                </div>
                <div className="modal-body">
                    <div className="input-wrapper gap-10 flex-column">
                        <div>
                            <span>Editar dicionário </span>
                            <SelectDictionary onChange={name => {
                                setCurrentDictionary(api.dictionaries.getDictionary(name).dictionary)
                            }} />
                        </div>

                        <label>
                            Nome
                            <input
                                className="simple"
                                type="text" {...register("newName")}
                            />
                        </label>

                        {
                            editing_default ?
                                <span>Este é o dicionário padrão.</span> :
                                <label>
                                    <span>Definir como padrão </span>
                                    <input
                                        type="checkbox" {...register("setDefault")}
                                    />
                                </label>
                        }
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="submit">
                        Editar
                    </button>
                    <button
                        className="cancel"
                        onClick={props.onClose}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </ModalWrapper >
    )
}