interface modalWrapperProps {
    children: JSX.Element
}

export function ModalWrapper(props: modalWrapperProps) {
    return (
        <div className="modal-wrapper">
            {props.children}
        </div>
    )
}