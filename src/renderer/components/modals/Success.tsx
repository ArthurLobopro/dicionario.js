import { SuccessIcon } from "../icons"
import { AlertModalProps, AlertModalWithIcon } from "./Alert"

type SuccessModalProps = Omit<AlertModalProps, "title"> & Partial<Pick<AlertModalProps, "title">>

export function SuccessModal(props: SuccessModalProps) {
    const {
        title = "Sucesso",
        message,
        onClose
    } = props

    return (
        <AlertModalWithIcon
            title={title} children={message}
            onClose={onClose}
            icon={<SuccessIcon />}
        />
    )
}