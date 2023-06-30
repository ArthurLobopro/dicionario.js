import { useContext } from "react"
import { ModalContext } from "./ModalContext"

interface ModalCancelButtonProps {
    text?: string
}

export function CancelButton({ text = "Cancelar" }: ModalCancelButtonProps) {

    const { onClose } = useContext(ModalContext)

    return (
        <button className="cancel" onClick={() => onClose(false)}>
            {text}
        </button>
    )
}

interface SubmitButtonProps {
    text?: string
}

export function SubmitButton({ text = "Enviar" }: SubmitButtonProps) {

    const { onClose } = useContext(ModalContext)

    return (
        <button onClick={() => onClose(true)}>
            {text}
        </button>
    )
}