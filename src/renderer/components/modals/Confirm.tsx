import { ModalWrapper } from "./Wrapper"

interface ConfirmModalProps {
    title?: string
    message: string
    onClose: (confirm: boolean) => void
}

export function ConfirmModal(props: ConfirmModalProps) {
    const { title = "Atenção", message, onClose = () => { } } = props

    return (
        <ModalWrapper>
            <div className="modal">
                <div className="modal-header">
                    {title}
                </div>
                <div className="modal-body">
                    {message}
                </div>
                <div className="modal-footer">
                    <button onClick={() => {
                        onClose(true)
                    }}>Sim</button>
                    <button className="cancel" onClick={() => {
                        onClose(false)
                    }}>Não</button>
                </div>
            </div>
        </ModalWrapper>
    )
}