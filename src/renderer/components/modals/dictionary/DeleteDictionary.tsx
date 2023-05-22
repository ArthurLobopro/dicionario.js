import { useState } from "react"
import { api } from "../../../../store/Api"
import { DictionariesController } from "../../../../store/Controllers/Dictionaries"
import { useModal } from "../../../hooks/useModal"
import { SelectDictionary } from "../../selects/Dictionary"
import { AlertModal } from "../Alert"
import { SuccessModal } from "../Success"
import { WarningModal } from "../Warning"
import { ModalWrapper } from "../Wrapper"

interface modal_props {
    onClose: () => void
}

export function DeleteDictionaryModal(props: modal_props) {
    const [dictionary, setDictionary] = useState<string>("")

    const modal = useModal()

    async function HandleDelete() {
        if (dictionary === "") {
            return
        }

        if (dictionary === DictionariesController.getDefaultDictionary().name) {
            return modal.open(<AlertModal
                title="Erro" onClose={modal.close}
                message={`Você não pode deletar o dicionário padrão`}
            />)
        }

        function HandleClose() {
            modal.close()
            props.onClose()
        }

        function deleteDictionary() {
            try {
                api.dictionaries.removeDictionary(dictionary)
                modal.open(<SuccessModal
                    onClose={HandleClose}
                    message={`Dicionário "${dictionary}" deletado com sucesso`}
                />)
            } catch (error) {
                modal.open(<AlertModal
                    title="Erro" onClose={HandleClose}
                    message={`Houve um erro ao deletar o dicionário "${dictionary}"`}
                />)
            }
        }

        const word_count = api.dictionaries.getDictionary(dictionary).Words.length

        if (word_count === 0) {
            return deleteDictionary()
        } else {
            modal.open(<WarningModal
                title="Você tem certeza?"
                onClose={(confirmed) => {
                    if (confirmed) {
                        deleteDictionary()
                    } else {
                        modal.close()
                    }
                }}
            >
                O dicionário <strong>"{dictionary}"</strong> possui <strong>{word_count}</strong> palavra{word_count > 1 ? "s" : ""}, deseja apagá-lo mesmo assim? <br />
                Lembre-se: Esta ação não pode ser desfeita.
            </WarningModal>)
        }
    }

    return (
        <ModalWrapper>
            <div className="modal">
                {modal.content}
                <div className="modal-header">
                    Deletar Dicionário
                </div>
                <div className="modal-body">
                    <span>Deletar o dicinário: </span>
                    <SelectDictionary onChange={setDictionary} />
                </div>
                <div className="modal-footer">
                    <button onClick={HandleDelete}>
                        Deletar
                    </button>
                    <button className="cancel" onClick={() => props.onClose()}>
                        Cancelar
                    </button>
                </div>
            </div>
        </ModalWrapper>
    )
}