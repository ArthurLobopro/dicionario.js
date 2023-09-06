import {
  CancelButton,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalWrapper,
  OkButton,
} from "./base"

interface ReleaseModalProps {
  onClose: (v: boolean) => void
}

export function ReleaseModal(props: ReleaseModalProps) {
  return (
    <ModalWrapper>
      <Modal type="confirm" className="release-modal" onClose={props.onClose}>
        <ModalHeader title="Atualização disponível" />
        <ModalBody>
          Uma nova atualização está disponível, reinicie o aplicativo para
          atualizar.
        </ModalBody>
        <ModalFooter>
          <OkButton text="Reiniciar Agora" />
          <CancelButton text="Atualizar Depois" />
        </ModalFooter>
      </Modal>
    </ModalWrapper>
  )
}
