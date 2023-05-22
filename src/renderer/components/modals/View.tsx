import { DictionaryController } from "../../../store/Controllers/Dictionary"
import { formatDate } from "../../Util"
import { ModalWrapper } from "./Wrapper"

interface ViewModalProps {
    dictionary: DictionaryController,
    word: string,
    onClose: () => void
}

export function ViewModal(props: ViewModalProps) {
    const word_data = props.dictionary.Words.getWords()[props.word]

    return (
        <ModalWrapper>
            <div className="modal full" id="view-word">
                <div className="dashed-border spacing-16">
                    <h1 className="flex-center capitalize">
                        {props.word}
                    </h1>
                    <textarea readOnly={true} className="info big full-heigth" value={word_data.definition} ></textarea>
                    <div className="date-wrapper">
                        <div className="flex-column gap-10">
                            <span>Data de registro</span>
                            <span className="info">{formatDate(word_data.register.toISOString())}</span>
                        </div>
                        {word_data.lastEdit ?
                            <div className="flex-column gap-10">
                                <span>Última edição</span>
                                <span className="info">{formatDate(word_data.lastEdit.toISOString())}</span>
                            </div> : null
                        }
                    </div>
                    <button onClick={props.onClose}>Ok</button>
                </div>
            </div>
        </ModalWrapper>
    )
}