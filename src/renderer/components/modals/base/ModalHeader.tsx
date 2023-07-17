import { useContext } from "react"
import { CircleButton } from "../../base/CircleButton"
import { CloseIcon } from "../../icons"
import { ModalContext } from "./ModalContext"

interface ModalHeaderProps {
  title: string
  closeIcon?: boolean
}

export function ModalHeader(props: ModalHeaderProps) {
  const { onClose } = useContext(ModalContext)

  return (
    <div className="modal-header">
      {props.title}

      {props.closeIcon && (
        <CircleButton
          title="Fechar"
          small
          onClick={onClose.bind({}, false)}
          useDiv={true}
        >
          <CloseIcon />
        </CircleButton>
      )}
    </div>
  )
}
