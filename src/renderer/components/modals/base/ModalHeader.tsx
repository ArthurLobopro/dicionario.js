interface ModalHeaderProps {
    title: string
}

export function ModalHeader(props: ModalHeaderProps) {
    return (
        <div className="modal-header">
            {props.title}
        </div>
    )
}