import { PropsWithChildren } from "react"
import { WarningIcon } from "../icons"
import { ModalWithIcon } from "./ModalWithIcon"

interface WarningModalProps extends PropsWithChildren {
    title?: string
    onClose: (confirm: boolean) => void
}

export function WarningModal(props: WarningModalProps) {
    const { title = "Atenção" } = props

    return (
        <ModalWithIcon
            title={title}
            icon={<WarningIcon />}
            onClose={props.onClose}
            children={props.children}
            type="confirm"
        />
    )
}