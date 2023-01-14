import { PropsWithChildren } from "react"
import { ModalWrapper } from "./Wrapper"
import { WarningIcon } from "../icons"

interface WarningModalProps extends PropsWithChildren {
    title?: string
    onClose: (confirm: boolean) => void
}

export function WarningModal(props: WarningModalProps) {
    const { title = "Atenção", children, onClose = () => { } } = props

    return (
        <ModalWrapper>
            <div className="modal">
                <div className="modal-header bold">
                    {title}
                </div>
                <div className="modal-body">
                    {/* {children} */}
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