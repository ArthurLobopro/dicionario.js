import { useNavigate } from "react-router-dom"
import { DictionaryController } from "../../store/Controllers/Dictionary"
import { CircleButton } from "./CircleButton"
import { ConfirmModal } from "./modals/Confirm"
import { ViewModal } from "./modals/View"
import { useModal } from "../hooks/useModal"
import {
    EditIcon,
    EyeIcon, TrashIcon
} from "./icons"

interface WordProps {
    word: {
        lastEdit?: Date | undefined
        definition: string
        register: Date
        word: string
    }
    modal: ReturnType<typeof useModal>
    dictionary: DictionaryController
    reload: () => void
}
export function Word(props: WordProps) {
    const { modal, word, dictionary, reload } = props

    function ShowViewModal() {
        modal.open(<ViewModal
            onClose={modal.close}
            dictionary={dictionary}
            word={word.word} />)
    }

    function DeleteWord() {
        modal.open(<ConfirmModal
            message="Essa ação é irreversível. Deseja realmente excluir esta palavra?"
            title="Você tem certeza?"
            onClose={(confirm) => {
                if (confirm) {
                    dictionary.Words.deleteWord(word.word)
                    reload()
                }
                modal.close()
            }} />)
    }

    const navigate = useNavigate()

    return (
        <div className="word" key={word.word} onDoubleClick={ShowViewModal}>
            <div className="content">
                <div className="word-header">
                    {word.word}
                </div>
                <div className="word-definition">
                    {word.definition}
                </div>
            </div>
            <div className="controls">
                <CircleButton title="Visualizar" onClick={ShowViewModal}>
                    <EyeIcon />
                </CircleButton>
                <CircleButton title="Editar"
                    onClick={() => {
                        navigate(`/update/${dictionary.name}/${word.word}`)
                    }}
                >
                    <EditIcon id="edit" />
                </CircleButton>
                <CircleButton title="Apagar" onClick={DeleteWord}>
                    <TrashIcon id="delete" />
                </CircleButton>
            </div>
        </div>
    )
}
