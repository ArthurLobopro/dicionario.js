import { ipcRenderer } from "electron"
import fs from "node:fs"
import { useRef, useState } from "react"
import { DictionariesController } from "../../../../store/Controllers/Dictionaries"
import { dictionary, dictionarySchema } from "../../../../store/ZodSchemas/dictionary"
import { useModal } from "../../../hooks/useModal"
import { If } from "../../If"
import { ErrorModal } from "../Error"
import { SuccessModal } from "../Success"
import { ModalWrapper } from "../base/Wrapper"

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
    const modalRef = useRef<HTMLDivElement>(null)
    const firstRender = useRef(true)

    function handleAnimationEnd() {
        if (firstRender.current) {
            firstRender.current = false
            modalRef.current?.classList.remove("show")
        } else {
            if (modalRef.current?.classList.contains("close")) {
                close()
            }
        }
    }

    function close() {
        modalRef.current?.classList.add("close")
    }

    const readyToImport = selectedFile.path && selectedFile.content.words

    const alreadyExists = readyToImport && DictionariesController.getDictionariesNames().includes(selectedFile.content.name)

    const [action, setAction] = useState<"merge" | "rename">("rename")
    const [newName, setNewName] = useState("")

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
            return modal.open(<ErrorModal
                onClose={modal.close}
                message="Arquivo inválido"
            />)
        }

        setSelectedFile({
            path: file,
            content: check.data as dictionary
        })
    }

    function HandleSubmit() {
        if (!readyToImport) {
            return
        }

        if (alreadyExists) {
            if (action === "merge") {
                DictionariesController.mergeDictionary(selectedFile.content)

                return modal.open(<SuccessModal
                    message="Dicionário mesclado com sucesso"
                    onClose={props.onClose}
                />)
            }

            DictionariesController.importDictionary({
                ...selectedFile.content,
                name: newName
            })

            return modal.open(<SuccessModal
                message="Dicionário importado com sucesso"
                onClose={props.onClose}
            />)
        } else {
            DictionariesController.importDictionary(selectedFile.content)

            modal.open(<SuccessModal
                message="Dicionário importado com sucesso"
                onClose={props.onClose}
            />)
        }
    }

    return (
        <ModalWrapper>
            <div
                className="modal show" ref={modalRef}
                onAnimationEnd={handleAnimationEnd}
            >
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

                        <If condition={!!alreadyExists}>
                            <div className="flex-column gap">
                                <p>
                                    Já existe um dicionário com o nome "{selectedFile.content.name}".
                                </p>

                                <div className="flex gap-10 align-center">
                                    O que deseja fazer?
                                    <select onChange={(event) => {
                                        setAction(event.target.value as "merge" | "rename")
                                    }} value={action}>
                                        <option value="rename">Renomear</option>
                                        <option value="merge">Mesclar</option>
                                    </select>
                                </div>

                                <If
                                    condition={action === "rename"}
                                    else={
                                        <span>As palavras que ainda não existirem serão cadastradas</span>
                                    }
                                >
                                    <div className="flex-column gap-10 align-center">
                                        <span>Novo nome:</span>
                                        <input
                                            type="text" className="simple"
                                            value={newName} onChange={(event) => {
                                                setNewName(event.target.value)
                                            }}
                                        />
                                    </div>
                                </If>
                            </div>
                        </If>

                        <If condition={
                            !!selectedFile.path && !!selectedFile.content.words && !alreadyExists
                        }>
                            <div className="flex-column gap-10">
                                <p>
                                    Foi encontrado um dicionário com as seguintes informações:
                                </p>

                                <ul>
                                    <li>
                                        Nome: {selectedFile.content.name}
                                    </li>
                                    <li>
                                        Número de palavras: {selectedFile.content.words?.length}
                                    </li>
                                </ul>
                            </div>
                        </If>
                    </div>
                </div>

                <div className="modal-footer">
                    <button {
                        ...(!!readyToImport ? {
                            onClick: HandleSubmit
                        } : {
                            className: "disabled",
                            title: "Selecione um arquivo válido"
                        })
                    }>
                        <If
                            condition={!alreadyExists && !(action === "merge")}
                            else={"Mesclar"}
                        >
                            Importar
                        </If>
                    </button>
                    <button className="cancel" onClick={props.onClose}>
                        Cancelar
                    </button>
                </div>
            </div>
        </ModalWrapper>
    )
}