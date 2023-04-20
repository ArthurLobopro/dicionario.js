import { ModalWrapper } from "./Wrapper"

interface alertProps {
    title: string | JSX.Element
    message: string
    onClose: () => void
}

export function AlertModal(props: alertProps) {

    return (
        <ModalWrapper>
            <div className="modal">
                <div className="modal-header">
                    {props.title}
                </div>
                <div className="modal-body">
                    {props.message}
                </div>
                <div className="modal-footer">
                    <button onClick={props.onClose} autoFocus={true}>
                        Ok
                    </button>
                </div>
            </div>
        </ModalWrapper>
    )
}