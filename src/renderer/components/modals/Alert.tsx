import { useRef } from "react"
import { CircleButton } from "../CircleButton"
import { CloseIcon } from "../icons"
import { ModalWrapper } from "./Wrapper"

export interface AlertModalProps {
    title: string | JSX.Element
    message: string
    onClose: () => void
}

export function AlertModal(props: AlertModalProps) {

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

interface AlertWithIconProps {
    title: string | JSX.Element
    icon: JSX.Element
    children: string | JSX.Element
    onClose: () => void
}

export function AlertModalWithIcon(props: AlertWithIconProps) {

    const { title, icon, children, onClose } = props

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
            onClose()
        }
    }

    return (
        <ModalWrapper>
            <div className="modal show"
                ref={modalRef}
                onAnimationEnd={handleAnimationEnd}
            >
                <div className="modal-header">
                    {title}
                    <CircleButton title="Fechar" small onClick={handleClose}>
                        <CloseIcon />
                    </CircleButton>
                </div>
                <div className="modal-body">
                    <div className="grid-left-center">
                        <div className="icon-wrapper">
                            {icon}
                        </div>
                        <div>
                            {children}
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={handleClose} autoFocus={true}>
                        Ok
                    </button>
                </div>
            </div>
        </ModalWrapper>
    )
}