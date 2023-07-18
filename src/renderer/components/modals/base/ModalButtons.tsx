import { useContext } from "react"
import { ModalContext } from "./ModalContext"

interface GeneralButtonProps {
  text?: string
  autoFocus?: boolean
}

export function CancelButton({
  text = "Cancelar",
  autoFocus = false,
}: GeneralButtonProps) {
  const { onClose } = useContext(ModalContext)

  return (
    <button
      className="cancel"
      type="button"
      onClick={() => onClose(false)}
      autoFocus={autoFocus}
    >
      {text}
    </button>
  )
}

type OkButtonProps = GeneralButtonProps

export function OkButton({ text = "Ok", autoFocus = true }: OkButtonProps) {
  const { onClose } = useContext(ModalContext)

  return (
    <button onClick={() => onClose(true)} type="button" autoFocus={autoFocus}>
      {text}
    </button>
  )
}

type SubmitButtonProps = Omit<GeneralButtonProps, "autoFocus">

export function SubmitButton({ text = "Enviar" }: SubmitButtonProps) {
  return <button type="submit">{text}</button>
}
