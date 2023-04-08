import { formatDate } from "../../../Util"
import { DictionaryController } from "../../../store/Controllers/Dictionary"
import { ModalWrapper } from "./Wrapper"

interface viewModalProps {
    dictionary: DictionaryController,
    word: string,
    onClose: () => void
}

export function ViewModal(props: viewModalProps) {
    const word_data = props.dictionary.Words.getWords()[props.word]

    return (
        <ModalWrapper>
            <div className="modal">
                <div className="dashed-border spacing-16 grid-fill-center gap">
                    <div>
                        <div>Palavra</div>
                        <textarea readOnly={true} rows={1} className="info big">{props.word}</textarea>
                    </div>
                    <div>
                        <div>Significado</div>
                        <textarea rows={3} readOnly={true} className="info big" >{word_data.definition}</textarea>
                    </div>
                    <div className="date-wrapper">
                        <div>
                            <span>Data de registro</span>
                            <span className="info">{formatDate(word_data.register.toISOString())}</span>
                        </div>
                        {word_data.lastEdit ?
                            <div>
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