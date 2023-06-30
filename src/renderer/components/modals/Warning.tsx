import { PropsWithChildren } from "react"
import { WarningIcon } from "../icons"
import { Modal } from "./base/Modal"
import { ModalBody } from "./base/ModalBody"
import { CancelButton, SubmitButton } from "./base/ModalButtons"
import { ModalFooter } from "./base/ModalFooter"
import { ModalHeader } from "./base/ModalHeader"
import { ModalWrapper } from "./base/Wrapper"

interface WarningModalProps extends PropsWithChildren {
    title?: string
    onClose: (confirm: boolean) => void
}

export function WarningModal(props: WarningModalProps) {
    const { title = "Atenção", children } = props

    return (
        <ModalWrapper>
            <Modal onClose={props.onClose} type="confirm">
                <ModalHeader title={title} />
                <ModalBody>
                    <div className="grid-left-center">
                        <div>
                            <WarningIcon height={35} width={35} style={{ margin: 10 }} />
                        </div>
                        <div>
                            {children}
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <SubmitButton text="Sim" />
                    <CancelButton text="Não" />
                </ModalFooter>
            </Modal>
        </ModalWrapper>
    )
}