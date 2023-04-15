import { CheckIcon } from "../icons"
import { AlertModal } from "./Alert"
import { ModalWrapper } from "./Wrapper"

interface alertProps {
    title?: string | JSX.Element
    message: string
    onClose: () => void
}

const DefaultTitle = () => (
    <div className="flex gap-4 align-center">
        Sucesso
        <CheckIcon />
    </div>
)

export function SuccessModal(props: alertProps) {

    const {
        title = <DefaultTitle />,
        message,
        onClose
    } = props

    return (
        <AlertModal title={title} message={message} onClose={onClose} />
    )
}