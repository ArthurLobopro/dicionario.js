import { If } from "../base/If"
import { CancelButton, OkButton } from "./base/ModalButtons"

import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalWrapper,
} from "./base"

type alertProps = {
  type: "alert"
  onClose: VoidFunction
}

type confirmProps = {
  type: "confirm"
  onClose: (confirm: boolean) => void
}

type ModifyTypeProps = alertProps | confirmProps

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
            <OkButton text="Sim" />
            <CancelButton text="Não" autoFocus />
          </If>
        </ModalFooter>
      </Modal>
    </ModalWrapper>
  )
}
