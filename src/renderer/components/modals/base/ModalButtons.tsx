import { useContext } from "react"
import { ModalContext } from "./ModalContext"

interface GeneralButtonProps {
    text?: string
}


export function CancelButton({ text = "Cancelar" }: GeneralButtonProps) {

    const { onClose } = useContext(ModalContext)

    return (
        <button className="cancel" type="button" onClick={() => onClose(false)}>
            {text}
        </button>
    )
}

export function OkButton({ text = "Ok" }: GeneralButtonProps) {

    const { onClose } = useContext(ModalContext)

    return (
        <button onClick={() => onClose(true)} type="button">
            {text}
        </button>
    )
}

export function SubmitButton({ text = "Enviar" }: GeneralButtonProps) {
    return (
        <button type="submit">
            {text}
        </button>
    )
}