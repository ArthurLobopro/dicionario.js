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

interface OkButtonProps extends GeneralButtonProps {
  autoFocus?: boolean
}

export function OkButton({ text = "Ok", autoFocus = true }: OkButtonProps) {
  const { onClose } = useContext(ModalContext)

  return (
    <button onClick={() => onClose(true)} type="button" autoFocus={autoFocus}>
      {text}
    </button>
  )
}

export function SubmitButton({ text = "Enviar" }: GeneralButtonProps) {
  return <button type="submit">{text}</button>
}
