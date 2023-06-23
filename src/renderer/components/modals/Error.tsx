import { ErrorIcon } from "../icons"
import { ModalProps, ModalWithIcon } from "./ModalWithIcon"

type ErrorModalProps = Omit<ModalProps, "title"> & Partial<Pick<ModalProps, "title">>

export function ErrorModal(props: ErrorModalProps) {
    const {
        title = "Erro",
        message,
        onClose
    } = props

    return (
        <ModalWithIcon
            title={title} children={message}
            onClose={onClose} icon={<ErrorIcon />}
            type="alert"
        />
    )
}