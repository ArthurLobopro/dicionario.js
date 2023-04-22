import { ErrorIcon } from "../icons"
import { AlertModalProps, AlertModalWithIcon } from "./Alert"

type ErrorModalProps = Omit<AlertModalProps, "title"> & Partial<Pick<AlertModalProps, "title">>

export function ErrorModal(props: ErrorModalProps) {
    const {
        title = "Erro",
        message,
        onClose
    } = props

    return (
        <AlertModalWithIcon
            title={title} children={message}
            onClose={onClose} icon={<ErrorIcon />}
        />
    )
}