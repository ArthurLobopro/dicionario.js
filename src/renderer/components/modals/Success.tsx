import { SuccessIcon } from "../icons"
import { ModalProps, ModalWithIcon } from "./ModalWithIcon"

type SuccessModalProps = Omit<ModalProps, "title"> & Partial<Pick<ModalProps, "title">>

export function SuccessModal(props: SuccessModalProps) {
    const {
        title = "Sucesso",
        message,
        onClose
    } = props

    return (
        <ModalWithIcon
            title={title} children={message}
            onClose={onClose}
            icon={<SuccessIcon />}
            type="alert"
        />
    )
}