import { If } from "../If"
import { Modal } from "./base/Modal"
import { ModalBody } from "./base/ModalBody"
import { CancelButton, OkButton } from "./base/ModalButtons"
import { ModalFooter } from "./base/ModalFooter"
import { ModalHeader } from "./base/ModalHeader"
import { ModalWrapper } from "./base/Wrapper"

type ModifyTypeProps =
  | {
      type: "alert"
      onClose: VoidFunction
    }
  | {
      type: "confirm"
      onClose: (confirm: boolean) => void
    }

export type ModalProps = {
  title: string
  message?: string
  closeIcon?: boolean
  onClose: VoidFunction
}

type ModalWithIconsProps = React.PropsWithChildren &
  Omit<ModalProps, "onClose"> & { icon: React.ReactNode } & ModifyTypeProps

export function ModalWithIcon(props: ModalWithIconsProps) {
  const { title, icon, children, closeIcon = true } = props

  return (
    <ModalWrapper>
      <Modal onClose={props.onClose as VoidFunction} type={props.type}>
        <ModalHeader title={title} closeIcon={closeIcon} />
        <ModalBody>
          <div className="grid-left-center">
            <div className="icon-wrapper">{icon}</div>
            <div>{children}</div>
          </div>
        </ModalBody>
        <ModalFooter>
          <If
            condition={props.type === "confirm"}
            else={<OkButton autoFocus />}
          >
            <OkButton text="Sim" autoFocus />
            <CancelButton text="Não" />
          </If>
        </ModalFooter>
      </Modal>
    </ModalWrapper>
  )
}
