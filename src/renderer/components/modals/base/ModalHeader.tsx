import { CloseModalButton } from "./ModalButtons"

interface ModalHeaderProps {
  title: string
  closeIcon?: boolean
}

export function ModalHeader(props: ModalHeaderProps) {
  return (
    <div className="modal-header">
      {props.title}

      {props.closeIcon && <CloseModalButton />}
    </div>
  )
}
