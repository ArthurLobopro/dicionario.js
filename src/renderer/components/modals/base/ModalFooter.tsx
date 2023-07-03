interface ModalFooterProps {
    children: React.ReactNode
}

export function ModalFooter(props: ModalFooterProps) {
    return (
        <div className="modal-footer">
            {props.children}
        </div>
    )
}