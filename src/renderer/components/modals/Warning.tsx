import { PropsWithChildren, useRef } from "react"
import { WarningIcon } from "../icons"
import { ModalWrapper } from "./Wrapper"

interface WarningModalProps extends PropsWithChildren {
    title?: string
    onClose: (confirm: boolean) => void
}

export function WarningModal(props: WarningModalProps) {
    const { title = "Atenção", children, onClose = () => { } } = props

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
                className="modal show" ref={modalRef}
                onAnimationEnd={handleAnimationEnd}
            >
                <div className="modal-header bold">
                    {title}
                </div>
                <div className="modal-body">
                    <div className="grid-left-center">
                        <div>
                            <WarningIcon height={35} width={35} style={{ margin: 10 }} />
                        </div>
                        <div>
                            {children}
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={() => handleClose(true)}>Sim</button>
                    <button className="cancel" onClick={() => handleClose(false)}>Não</button>
                </div>
            </div>
        </ModalWrapper>
    )
}