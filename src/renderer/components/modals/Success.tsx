import { CheckIcon } from "../icons"
import { AlertModal, AlertModalProps } from "./Alert"

const DefaultTitle = () => (
    <div className="flex gap-4 align-center">
        Sucesso
        <CheckIcon />
    </div>
)

type SuccessModalProps = Omit<AlertModalProps, "title"> & Partial<Pick<AlertModalProps, "title">>

export function SuccessModal(props: SuccessModalProps) {
    const {
        title = <DefaultTitle />,
        message,
        onClose
    } = props

    return (
        <AlertModal title={title} message={message} onClose={onClose} />
    )
}