import { Modal } from "./base/Modal"
import { ModalBody } from "./base/ModalBody"
import { CancelButton, OkButton } from "./base/ModalButtons"
import { ModalFooter } from "./base/ModalFooter"
import { ModalHeader } from "./base/ModalHeader"
import { ModalWrapper } from "./base/Wrapper"

interface ReleaseModalProps {
    onClose: (v: boolean) => void
}

export function ReleaseModal(props: ReleaseModalProps) {
    return (
        <ModalWrapper>
            <Modal type="confirm" className="release-modal" onClose={props.onClose}>
                <ModalHeader title="Atualização disponível" />
                <ModalBody>
                    Uma nova atualização está disponível, reinicie o aplicativo para atualizar.
                </ModalBody>
                <ModalFooter>
                    <OkButton text="Reiniciar Agora" />
                    <CancelButton text="Atualizar Depois" />
                </ModalFooter>
            </Modal>
        </ModalWrapper>
    )
}