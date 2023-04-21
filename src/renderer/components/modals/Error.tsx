import { ErrorIcon } from "../icons"
import { AlertModal, AlertModalProps } from "./Alert"

const DefaultTitle = () => (
    <div className="flex gap-4 align-center">
        Erro
        <ErrorIcon />
    </div>
)

type ErrorModalProps = Omit<AlertModalProps, "title"> & Partial<Pick<AlertModalProps, "title">>

export function ErrorModal(props: ErrorModalProps) {
    const {
        title = <DefaultTitle />,
        message,
        onClose
    } = props

    return (
        <AlertModal title={title} message={message} onClose={onClose} />
    )
}