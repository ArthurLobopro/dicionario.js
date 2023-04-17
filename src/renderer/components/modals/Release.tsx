import { ModalWrapper } from "./Wrapper"

interface releaseModalProps {
    onClose: (v: boolean) => void
}

export function ReleaseModal(props: releaseModalProps) {
    return (
        <ModalWrapper>
            <div className="modal release-modal">
                <div className="modal-header">
                    Atualização disponível
                </div>
                <div className="modal-body">
                    Uma nova atualização está disponível, reinicie o aplicativo para atualizar.
                </div>
                <div className="modal-footer">
                    <button onClick={() => props.onClose(true)}>Reiniciar Agora</button>
                    <button className="cancel stroke" onClick={() => props.onClose(false)}>Atualizar Depois</button>
                </div>
            </div>
        </ModalWrapper>
    )
}