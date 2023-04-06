import { useEffect, useState } from "react"
import { ModalWrapper } from "./Wrapper"
import { api } from "../../../store/Api"
import { SelectDictionary } from "../selects/Dictionary"
import { dictionary } from "../../../store/Schemas"

interface editDictionaryProps {
    onClose: () => void
}

export function EditDictionaryModal(props: editDictionaryProps) {
    const [currentDictionary, setCurrentDictionary] = useState(api.dictionaries.getDictionaries()[0])

    const default_dictionary = api.dictionaries.getDefaultDictionary()

    const editing_default = currentDictionary.name === default_dictionary.name

    const [data, setData] = useState<{ newName: string, setDefault: boolean }>({
        newName: currentDictionary.name,
        setDefault: editing_default
    })

    useEffect(() => {
        setData({
            newName: currentDictionary.name,
            setDefault: false
        })
    }, [currentDictionary])

    function HandleSubmit() {
        if (data.newName === "") {
            return
        }

        api.dictionaries.editDictionary(currentDictionary.name, data)
        props.onClose()
    }

    return (
        <ModalWrapper>
            <div className="modal" id="add-dictionary">
                <div className="modal-header">
                    Adicionar Dicionário
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
                                type="text" value={data.newName}
                                onChange={e => {
                                    setData({ ...data, newName: e.target.value })
                                }}
                            />
                        </label>


                        {
                            editing_default ?
                                <span>Este é o dicionário padrão.</span> :
                                <label>
                                    <span>Definir como padrão </span>
                                    <input
                                        type="checkbox" checked={data.setDefault}
                                        onChange={e => {
                                            setData({ ...data, setDefault: e.target.checked })
                                        }}
                                    />
                                </label>
                        }
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={HandleSubmit}>
                        Editar
                    </button>
                    <button
                        className="cancel"
                        onClick={() => props.onClose()}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </ModalWrapper >
    )
}