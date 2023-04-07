import { useState } from "react"
import { SelectDictionary } from "../../selects/Dictionary"
import { ModalWrapper } from "../Wrapper"
import { ipcRenderer } from "electron"
import { api } from "../../../../store/Api"
import { useModal } from "../../../hooks/useModal"
import { AlertModal } from "../Alert"

interface ExportDictionaryModalProps {
    onClose: () => void
}

type data = {
    dictionary: string
    path: string
}

export function ExportDictionaryModal(props: ExportDictionaryModalProps) {
    const [data, setData] = useState<data>({
        dictionary: api.dictionaries.getDefaultDictionary().name,
        path: ""
    })

    const modal = useModal()

    function HandleExport() {
        if (data.path === "") {
            modal.open(<AlertModal
                title="Erro" onClose={modal.close}
                message="Escolha um local para exportar o dicionário"
            />)
            return
        }

        api.dictionaries.exportDictionary(data.dictionary, data.path)

        modal.open(<AlertModal
            title="Sucesso" onClose={props.onClose}
            message="Dicionário exportado com sucesso!"
        />)
    }

    function HandlePickFolder() {
        const folder = ipcRenderer.sendSync("get-folder")

        if (folder === "canceled") return

        setData({ ...data, path: folder })
    }

    return (
        <ModalWrapper>

            <div className="modal">
                <div className="modal-header">
                    Exportar dicionário
                </div>
                <div className="modal-body">

                    {modal.content}

                    <div className="flex-column gap-10">
                        <div className="flex align-center gap-10">
                            <span>Exportar dicionário: </span>
                            <SelectDictionary
                                onChange={value => {
                                    setData({ ...data, dictionary: value })
                                }}
                            />
                        </div>

                        <div className="grid-column-fill-center align-center gap-10">
                            <span>Salvar em: </span>
                            <input
                                type="text" className="simple" readOnly
                                value={data.path}
                            />
                            <button className="simple" onClick={HandlePickFolder}>
                                Escolher pasta
                            </button>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={HandleExport}>
                        Exportar
                    </button>
                    <button className="cancel" onClick={props.onClose}>
                        Cancelar
                    </button>
                </div>
            </div>
        </ModalWrapper>
    )
}