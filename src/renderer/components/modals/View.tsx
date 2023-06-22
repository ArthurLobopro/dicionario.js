import { useRef } from "react"
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

    const firstRender = useRef(true)

    const modalRef = useRef<HTMLDivElement>(null)

    function handleClose() {
        modalRef.current?.classList.add("close")
    }

    function handleAnimationEnd() {
        if (firstRender.current) {
            firstRender.current = false
            modalRef.current?.classList.remove("show")
        } else {
            props.onClose()
        }
    }

    return (
        <ModalWrapper>
            <div
                className="modal full show" id="view-word"
                onAnimationEnd={handleAnimationEnd}
                ref={modalRef}
            >
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
                    <button onClick={handleClose}>Ok</button>
                </div>
            </div>
        </ModalWrapper>
    )
}