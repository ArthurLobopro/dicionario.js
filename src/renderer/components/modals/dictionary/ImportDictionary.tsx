import { ipcRenderer } from "electron"
import fs from "node:fs"
import { useState } from "react"
import { dictionary } from "../../../../store/Schemas"
import { dictionarySchema } from "../../../../store/ZodSchemas/dictionary"
import { useModal } from "../../../hooks/useModal"
import { AlertModal } from "../Alert"
import { ModalWrapper } from "../Wrapper"

function CheckFileContent(filePath: string) {
    const fileContent = fs.readFileSync(filePath, "utf-8")

    const json = JSON.parse(fileContent)

    const isValid = dictionarySchema.safeParse(json)

    if (isValid.success) {
        return { isValid: true, data: isValid.data }
    }

    return { isValid: false }
}

interface ImportDictionaryModalProps {
    onClose: () => void
}

export function ImportDictionaryModal(props: ImportDictionaryModalProps) {
    const [selectedFile, setSelectedFile] = useState({
        path: "",
        content: {} as dictionary
    })

    const modal = useModal()

    const readyToImport = selectedFile.path && selectedFile.content.words

    function HandlePickFile() {
        setSelectedFile({
            path: "",
            content: {} as dictionary
        })

        const file = ipcRenderer.sendSync("get-file")

        if (file === "canceled") {
            return
        }

        const check = CheckFileContent(file)

        if (!check.isValid) {
            modal.open(<AlertModal title="Erro" message="Arquivo inválido" onClose={modal.close} />)
            return
        }

        setSelectedFile({
            path: file,
            content: check.data as dictionary
        })
    }

    function HandleSubmit() {

    }

    return (
        <ModalWrapper>
            <div className="modal">
                {modal.content}
                <div className="modal-header">
                    Importar Dicionário
                </div>
                <div className="modal-body">
                    <div className="flex-column gap-10 align-center">
                        <div className="flex gap-10 align-center">
                            <span>Arquivo:</span>
                            <input
                                type="text" className="simple"
                                value={selectedFile.path}
                            />

                            <button className="simple" onClick={HandlePickFile}>
                                Selecionar
                            </button>
                        </div>

                        {
                            selectedFile.path && selectedFile.content.words ? (
                                <div className="flex-column gap-10">
                                    <p>
                                        Foi encontrado um dicionário com as seguintes informações:
                                    </p>

                                    <ul>
                                        <li>
                                            Nome: {selectedFile.content.name}
                                        </li>
                                        <li>
                                            Número de palavras: {selectedFile.content.words.length}
                                        </li>
                                    </ul>
                                </div>
                            ) : <></>
                        }
                    </div>


                </div>
                <div className="modal-footer">
                    <button {
                        ...readyToImport ? {
                            onClick: HandleSubmit
                        } : {
                            className: "disabled",
                            title: "Selecione um arquivo válido"
                        }
                    }>
                        Importar
                    </button>
                    <button className="cancel" onClick={props.onClose}>
                        Cancelar
                    </button>
                </div>
            </div>
        </ModalWrapper>
    )
}