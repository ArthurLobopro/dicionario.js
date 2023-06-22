import { useRef } from "react"
import { ModalWrapper } from "./Wrapper"

interface ConfirmModalProps {
    title?: string
    message: string
    onClose: (confirm: boolean) => void
}

export function ConfirmModal(props: ConfirmModalProps) {
    const { title = "Atenção", message, onClose = () => { } } = props

    const firstRender = useRef(true)
    const modalRef = useRef<HTMLDivElement>(null)
    const responseRef = useRef(false)

    function handleClose(confirm: boolean) {
        responseRef.current = confirm
        modalRef.current?.classList.add("close")
    }

    function handleAnimationEnd() {
        if (firstRender.current) {
            firstRender.current = false
            modalRef.current?.classList.remove("show")
        } else {
            onClose(responseRef.current)
        }
    }

    return (
        <ModalWrapper>
            <div
                className="modal show"
                ref={modalRef}
                onAnimationEnd={handleAnimationEnd}
            >
                <div className="modal-header">
                    {title}
                </div>
                <div className="modal-body">
                    {message}
                </div>
                <div className="modal-footer">
                    <button onClick={() => handleClose(true)}>
                        Sim
                    </button>
                    <button className="cancel" onClick={() => handleClose(false)}>
                        Não
                    </button>
                </div>
            </div>
        </ModalWrapper>
    )
}