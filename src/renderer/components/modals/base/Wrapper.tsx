interface ModalWrapperProps {
    children: JSX.Element
}

export function ModalWrapper(props: ModalWrapperProps) {
    return (
        <div className="modal-wrapper">
            {props.children}
        </div>
    )
}