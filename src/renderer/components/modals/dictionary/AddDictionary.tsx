import { useState } from "react"
import { ModalWrapper } from "../Wrapper"
import { api } from "../../../../store/Api"

interface addDictionaryProps {
    onClose: () => void
}

export function AddDictionaryModal(props: addDictionaryProps) {
    const [data, setData] = useState<{ name: string, setDefault: boolean }>({
        name: "",
        setDefault: false
    })

    function HandleSubmit() {
        if (data.name === "") {
            return
        }

        api.dictionaries.addDictionary(data.name, data.setDefault)
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
                        <label>
                            Nome
                            <input
                                type="text" value={data.name}
                                onChange={e => {
                                    setData({ ...data, name: e.target.value })
                                }}
                            />
                        </label>


                        <label>
                            <span>Tornar padrão </span>
                            <input
                                type="checkbox" checked={data.setDefault}
                                onChange={e => {
                                    setData({ ...data, setDefault: e.target.checked })
                                }}
                            />
                        </label>
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={HandleSubmit}>
                        Adicionar
                    </button>
                    <button
                        className="cancel"
                        onClick={() => props.onClose()}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </ModalWrapper>
    )
}