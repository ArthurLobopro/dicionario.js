import { api } from "../../../store/Api"
import { formatDate } from "../../../Util"
import { ModalWrapper } from "./Wrapper"

interface viewModalProps {
    word: string,
    onClose?: () => void
}

export function ViewModal(props: viewModalProps) {
    const word_data = api.words[props.word]

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
                        <textarea rows={3} readOnly={true} className="info big" >{word_data.definicao}</textarea>
                    </div>
                    <div className="date-wrapper">
                        <div>
                            <span>Data de registro</span>
                            <span className="info">{formatDate(word_data.registro.toISOString())}</span>
                        </div>
                        {word_data.ultimaEdicao ?
                            <div>
                                <span>Última edição</span>
                                <span className="info">{formatDate(word_data.ultimaEdicao.toISOString())}</span>
                            </div> : null
                        }
                    </div>
                    <button className="btn" onClick={props.onClose}>Ok</button>
                </div>
            </div>
        </ModalWrapper>
    )
}